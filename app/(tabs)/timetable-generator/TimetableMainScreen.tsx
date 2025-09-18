import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Users,
  BookOpen,
  UserCheck,
  MapPin,
  Eye,
  AlertTriangle,
  History,
  Download,
  Play,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTimetable } from '@/contexts/TimetableContext';

export default function TimetableMainScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { state } = useTimetable();

  const menuItems = [
    {
      id: 'classes',
      title: 'Class Management',
      subtitle: 'Manage classes and batches',
      icon: Users,
      screen: 'ClassManagement',
      count: state.classes.length,
    },
    {
      id: 'subjects',
      title: 'Subject Management',
      subtitle: 'Configure subjects and credits',
      icon: BookOpen,
      screen: 'SubjectManagement',
      count: state.subjects.length,
    },
    {
      id: 'faculty',
      title: 'Faculty Management',
      subtitle: 'Manage faculty and availability',
      icon: UserCheck,
      screen: 'FacultyManagement',
      count: state.faculty.length,
    },

    {
      id: 'preview',
      title: 'Schedule Preview',
      subtitle: 'View generated timetable',
      icon: Eye,
      screen: 'SchedulePreview',
      disabled: !state.currentTimetable,
    },
    {
      id: 'conflicts',
      title: 'Conflict Resolution',
      subtitle: 'Resolve scheduling conflicts',
      icon: AlertTriangle,
      screen: 'ConflictResolution',
      count: state.conflicts.length,
    },
    {
      id: 'history',
      title: 'History & Templates',
      subtitle: 'Saved timetables and templates',
      icon: History,
      screen: 'HistoryTemplates',
    },
    {
      id: 'export',
      title: 'Export / Import',
      subtitle: 'Backup and restore data',
      icon: Download,
      screen: 'ExportImport',
    },
  ];

  const handleMenuPress = (item: typeof menuItems[0]) => {
    if (item.disabled) {
      Alert.alert('Not Available', 'Please generate a timetable first.');
      return;
    }
    navigation.navigate(item.screen as never);
  };

  const handleQuickGenerate = () => {
    if (state.classes.length === 0 || state.subjects.length === 0 ||
        state.faculty.length === 0 || state.rooms.length === 0) {
      Alert.alert(
        'Incomplete Setup',
        'Please configure classes, subjects, faculty, and rooms before generating a timetable.'
      );
      return;
    }
    // Navigate to a quick generation screen or modal
    Alert.alert('Quick Generate', 'This will generate a timetable with current configuration.');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Timetable Generator</Text>
        <Text style={styles.headerSubtitle}>
          Complete timetable management system
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.quickGenerateButton}
            onPress={handleQuickGenerate}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.quickGenerateGradient}
            >
              <Play size={20} color="#FFFFFF" />
              <Text style={styles.quickGenerateText}>Generate Timetable</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Management Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, item.disabled && styles.menuItemDisabled]}
                onPress={() => handleMenuPress(item)}
                disabled={item.disabled}
              >
                <LinearGradient
                  colors={item.disabled ? ['#F3F4F6', '#E5E7EB'] : ['#F8FAFC', '#F1F5F9']}
                  style={styles.menuItemGradient}
                >
                  <View style={styles.menuItemHeader}>
                    <item.icon
                      size={24}
                      color={item.disabled ? '#9CA3AF' : '#3B82F6'}
                    />
                    {item.count !== undefined && (
                      <View style={styles.countBadge}>
                        <Text style={styles.countText}>{item.count}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.menuItemTitle, item.disabled && styles.menuItemTitleDisabled]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.menuItemSubtitle, item.disabled && styles.menuItemSubtitleDisabled]}>
                    {item.subtitle}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusValue}>{state.classes.length}</Text>
              <Text style={styles.statusLabel}>Classes</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusValue}>{state.subjects.length}</Text>
              <Text style={styles.statusLabel}>Subjects</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusValue}>{state.faculty.length}</Text>
              <Text style={styles.statusLabel}>Faculty</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusValue}>{state.rooms.length}</Text>
              <Text style={styles.statusLabel}>Rooms</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  quickGenerateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickGenerateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  quickGenerateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuItem: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItemDisabled: {
    opacity: 0.6,
  },
  menuItemGradient: {
    padding: 16,
    height: 120,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  countBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  menuItemTitleDisabled: {
    color: '#9CA3AF',
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  menuItemSubtitleDisabled: {
    color: '#D1D5DB',
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
