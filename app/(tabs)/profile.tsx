import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Animated,
  Image,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, User } from '@/contexts/AuthContext';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { useLocalization, SupportedLanguage } from '@/contexts/LocalizationContext';
import {
  User as UserIcon,
  Edit3,
  Save,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  IdCard,

  Moon,
  Sun,
  Monitor,
  Globe,
  Bell,
  Shield,
  ChevronRight,
  Camera,
  Check,
} from 'lucide-react-native';

interface EditableField {
  key: keyof User;
  label: string;
  value: string;
  editable: boolean;
  type: 'text' | 'email' | 'phone' | 'date';
  icon: React.ComponentType<any>;
}

export default function ProfileScreen() {
  const { user, updateUser } = useAuth();
  const { theme, isDark, themeMode, setThemeMode } = useTheme();
  const { t, currentLanguage, changeLanguage, supportedLanguages } = useLocalization();
  const insets = useSafeAreaInsets();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(user);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleSave = async () => {
    if (!editedUser) return;
    
    setIsSaving(true);
    try {
      const success = await updateUser(editedUser);
      if (success) {
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating your profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const updateField = (key: keyof User, value: string) => {
    if (!editedUser) return;
    
    setEditedUser({
      ...editedUser,
      [key]: value,
    });
  };

  const updateProfileField = (key: string, value: string) => {
    if (!editedUser?.profile) return;
    
    setEditedUser({
      ...editedUser,
      profile: {
        ...editedUser.profile,
        [key]: value,
      },
    });
  };

  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      case 'system':
        return Monitor;
      default:
        return Monitor;
    }
  };

  const getThemeLabel = (mode: ThemeMode) => {
    switch (mode) {
      case 'light':
        return t.lightMode;
      case 'dark':
        return t.darkMode;
      case 'system':
        return t.systemMode;
      default:
        return t.systemMode;
    }
  };

  const getLanguageName = (code: SupportedLanguage) => {
    const names: Record<SupportedLanguage, string> = {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch',
      zh: '中文',
      ja: '日本語',
      ar: 'العربية',
      hi: 'हिन्दी',
    };
    return names[code] || code;
  };

  const personalFields: EditableField[] = [
    {
      key: 'name',
      label: t.name,
      value: editedUser?.name || '',
      editable: true,
      type: 'text',
      icon: UserIcon,
    },
    {
      key: 'email',
      label: t.email,
      value: editedUser?.email || '',
      editable: false,
      type: 'email',
      icon: Mail,
    },
    {
      key: 'phone',
      label: t.phone,
      value: editedUser?.phone || '',
      editable: true,
      type: 'phone',
      icon: Phone,
    },
    {
      key: 'address',
      label: t.address,
      value: editedUser?.address || '',
      editable: true,
      type: 'text',
      icon: MapPin,
    },
    {
      key: 'dateOfBirth',
      label: t.dateOfBirth,
      value: editedUser?.dateOfBirth || '',
      editable: true,
      type: 'date',
      icon: Calendar,
    },
    {
      key: 'emergencyContact',
      label: t.emergencyContact,
      value: editedUser?.emergencyContact || '',
      editable: true,
      type: 'phone',
      icon: Phone,
    },
  ];

  const renderField = (field: EditableField) => (
    <View key={field.key} style={[
      styles.fieldContainer,
      { backgroundColor: theme.colors.background, borderColor: theme.colors.border }
    ]}>
      <View style={styles.fieldHeader}>
        <field.icon size={20} color={theme.colors.primary} />
        <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
          {field.label}
        </Text>
        {!field.editable && (
          <View style={[styles.readOnlyBadge, { backgroundColor: theme.colors.textSecondary + '20' }]}>
            <Text style={[styles.readOnlyText, { color: theme.colors.textSecondary }]}>
              Read Only
            </Text>
          </View>
        )}
      </View>
      
      {isEditing && field.editable ? (
        <TextInput
          style={[
            styles.fieldInput,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            }
          ]}
          value={field.value}
          onChangeText={(value) => updateField(field.key, value)}
          placeholder={`Enter ${field.label.toLowerCase()}`}
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType={field.type === 'email' ? 'email-address' : field.type === 'phone' ? 'phone-pad' : 'default'}
        />
      ) : (
        <Text style={[
          styles.fieldValue,
          { color: field.value ? theme.colors.text : theme.colors.textSecondary }
        ]}>
          {field.value || 'Not provided'}
        </Text>
      )}
    </View>
  );

  const renderSettingsSection = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {t.settings}
      </Text>
      
      {/* Theme Setting */}
      <TouchableOpacity
        style={[
          styles.settingItem,
          { backgroundColor: theme.colors.background, borderColor: theme.colors.border }
        ]}
        onPress={() => setShowThemeModal(true)}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.settingIcon, { backgroundColor: theme.colors.primary + '20' }]}>
            {React.createElement(getThemeIcon(themeMode), { size: 20, color: theme.colors.primary })}
          </View>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
              {t.appearance}
            </Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
              {getThemeLabel(themeMode)}
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      
      {/* Language Setting */}
      <TouchableOpacity
        style={[
          styles.settingItem,
          { backgroundColor: theme.colors.background, borderColor: theme.colors.border }
        ]}
        onPress={() => setShowLanguageModal(true)}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.settingIcon, { backgroundColor: (theme.colors.secondary || theme.colors.primary) + '20' }]}>
            <Globe size={20} color={theme.colors.secondary || theme.colors.primary} />
          </View>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
              {t.language}
            </Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
              {getLanguageName(currentLanguage)}
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      
      {/* Notifications Setting */}
      <View style={[
        styles.settingItem,
        { backgroundColor: theme.colors.background, borderColor: theme.colors.border }
      ]}>
        <View style={styles.settingLeft}>
          <View style={[styles.settingIcon, { backgroundColor: (theme.colors.info || theme.colors.primary) + '20' }]}>
            <Bell size={20} color={theme.colors.info || theme.colors.primary} />
          </View>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
              {t.notifications}
            </Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
              Push notifications
            </Text>
          </View>
        </View>
        <Switch
          value={true}
          onValueChange={() => {}}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary + '40' }}
          thumbColor={theme.colors.primary}
        />
      </View>
      
      {/* Privacy Setting */}
      <TouchableOpacity
        style={[
          styles.settingItem,
          { backgroundColor: theme.colors.background, borderColor: theme.colors.border }
        ]}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.settingIcon, { backgroundColor: (theme.colors.warning || theme.colors.primary) + '20' }]}>
            <Shield size={20} color={theme.colors.warning || theme.colors.primary} />
          </View>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
              {t.privacy}
            </Text>
            <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
              Data and privacy settings
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  if (!user || !editedUser) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          {t.loading}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <LinearGradient
        colors={isDark ? ['#1F2937', '#111827'] : ['#8B5CF6', '#7C3AED']}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: 'rgba(255, 255, 255, 0.2)', alignItems: 'center', justifyContent: 'center' }]}>
                  <UserIcon size={40} color="#FFFFFF" />
                </View>
              )}
              <TouchableOpacity style={styles.avatarEditButton}>
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileRole}>
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}{user.profile?.department ? ` • ${user.profile.department}` : ''}
              </Text>
              <Text style={styles.profileInstitution}>{user.institution}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.editButton}
            onPress={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isSaving}
          >
            {isEditing ? (
              <Save size={20} color="#FFFFFF" />
            ) : (
              <Edit3 size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
        
        {isEditing && (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { opacity: isSaving ? 0.5 : 1 }]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Personal Information */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t.personalInfo}
          </Text>
          {personalFields.map(renderField)}
        </Animated.View>

        {/* Academic Information */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t.academicInfo}
          </Text>
          
          <View style={[
            styles.fieldContainer,
            { backgroundColor: theme.colors.background, borderColor: theme.colors.border }
          ]}>
            <View style={styles.fieldHeader}>
              <Building size={20} color={theme.colors.primary} />
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                {t.department}
              </Text>
            </View>
            <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
              {user.profile?.department || 'Not specified'}
            </Text>
          </View>
          
          <View style={[
            styles.fieldContainer,
            { backgroundColor: theme.colors.background, borderColor: theme.colors.border }
          ]}>
            <View style={styles.fieldHeader}>
              <IdCard size={20} color={theme.colors.primary} />
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                {user.role === 'student' ? t.studentId : t.employeeId}
              </Text>
            </View>
            <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
              {user.profile?.studentId || user.profile?.employeeId || 'Not assigned'}
            </Text>
          </View>
          
          {user.role === 'student' && (
            <>
              <View style={[
                styles.fieldContainer,
                { backgroundColor: theme.colors.background, borderColor: theme.colors.border }
              ]}>
                <View style={styles.fieldHeader}>
                  <Calendar size={20} color={theme.colors.primary} />
                  <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                    Academic Year
                  </Text>
                </View>
                {isEditing ? (
                  <TextInput
                    style={[
                      styles.fieldInput,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      }
                    ]}
                    value={editedUser?.profile?.year || ''}
                    onChangeText={(value) => updateProfileField('year', value)}
                    placeholder="Enter academic year"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                ) : (
                  <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
                    {user.profile?.year || 'Not specified'}
                  </Text>
                )}
              </View>
              
              <View style={[
                styles.fieldContainer,
                { backgroundColor: theme.colors.background, borderColor: theme.colors.border }
              ]}>
                <View style={styles.fieldHeader}>
                  <Calendar size={20} color={theme.colors.primary} />
                  <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                    Semester
                  </Text>
                </View>
                {isEditing ? (
                  <TextInput
                    style={[
                      styles.fieldInput,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      }
                    ]}
                    value={editedUser?.profile?.semester || ''}
                    onChangeText={(value) => updateProfileField('semester', value)}
                    placeholder="Enter current semester"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                ) : (
                  <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
                    {user.profile?.semester || 'Not specified'}
                  </Text>
                )}
              </View>
            </>
          )}
        </Animated.View>

        {/* Settings */}
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {renderSettingsSection()}
        </Animated.View>
      </ScrollView>

      {/* Theme Modal */}
      <Modal
        visible={showThemeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setShowThemeModal(false)}>
              <Text style={[styles.modalCancelButton, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {t.appearance}
            </Text>
            <View style={styles.spacer} />
          </View>

          <View style={styles.modalContent}>
            {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => {
              const IconComponent = getThemeIcon(mode);
              const isSelected = themeMode === mode;
              
              return (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: isSelected ? theme.colors.primary + '10' : theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    }
                  ]}
                  onPress={() => {
                    setThemeMode(mode);
                    setShowThemeModal(false);
                  }}
                >
                  <View style={styles.themeOptionLeft}>
                    <View style={[
                      styles.themeOptionIcon,
                      { backgroundColor: isSelected ? theme.colors.primary : theme.colors.textSecondary + '20' }
                    ]}>
                      <IconComponent size={20} color={isSelected ? '#FFFFFF' : theme.colors.textSecondary} />
                    </View>
                    <Text style={[
                      styles.themeOptionText,
                      { color: isSelected ? theme.colors.primary : theme.colors.text }
                    ]}>
                      {getThemeLabel(mode)}
                    </Text>
                  </View>
                  {isSelected && (
                    <Check size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
              <Text style={[styles.modalCancelButton, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {t.language}
            </Text>
            <View style={styles.spacer} />
          </View>

          <View style={styles.modalContent}>
            {supportedLanguages.map((lang) => {
              const isSelected = currentLanguage === lang;
              
              return (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.languageOption,
                    {
                      backgroundColor: isSelected ? theme.colors.primary + '10' : theme.colors.surface,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    }
                  ]}
                  onPress={() => {
                    changeLanguage(lang);
                    setShowLanguageModal(false);
                  }}
                >
                  <Text style={[
                    styles.languageOptionText,
                    { color: isSelected ? theme.colors.primary : theme.colors.text }
                  ]}>
                    {getLanguageName(lang)}
                  </Text>
                  {isSelected && (
                    <Check size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 6,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  profileInstitution: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  editButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 12,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fieldContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  readOnlyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  readOnlyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  fieldInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  fieldValue: {
    fontSize: 16,
    lineHeight: 22,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalCancelButton: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    padding: 24,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  languageOptionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  spacer: {
    width: 60,
  },
});