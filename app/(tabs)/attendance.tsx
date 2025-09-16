import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  Modal,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Calendar,
  Hash,
  MapPin,
  User,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Share,
  BarChart3,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  date: string;
  time: string;
  status: 'present' | 'absent' | 'late';
  location?: string;
}

interface AttendancePin {
  id: string;
  pin: string;
  classId: string;
  className: string;
  createdBy: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  attendanceCount: number;
}

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Smith',
    classId: '1',
    className: 'Advanced Mathematics',
    date: '2024-01-15',
    time: '09:15',
    status: 'present',
    location: 'Room 101',
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'John Smith',
    classId: '2',
    className: 'Data Structures',
    date: '2024-01-15',
    time: '11:05',
    status: 'late',
    location: 'Lab 205',
  },
  {
    id: '3',
    studentId: '1',
    studentName: 'John Smith',
    classId: '3',
    className: 'Physics',
    date: '2024-01-14',
    time: '14:00',
    status: 'present',
    location: 'Room 301',
  },
];

const mockAttendancePins: AttendancePin[] = [
  {
    id: '1',
    pin: '8A9B2C4D5E6F7G8H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D',
    classId: '1',
    className: 'Advanced Mathematics',
    createdBy: 'Dr. Sarah Johnson',
    createdAt: '2024-01-15T09:00:00Z',
    expiresAt: '2024-01-15T10:30:00Z',
    isActive: true,
    attendanceCount: 28,
  },
  {
    id: '2',
    pin: '1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2W3X4Y5Z6A7B8C9D0E1F',
    classId: '2',
    className: 'Data Structures Lab',
    createdBy: 'Prof. Michael Chen',
    createdAt: '2024-01-15T11:00:00Z',
    expiresAt: '2024-01-15T12:30:00Z',
    isActive: false,
    attendanceCount: 25,
  },
];

export default function AttendanceScreen() {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  
  const [attendancePin, setAttendancePin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [showCreatePinModal, setShowCreatePinModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [generatedPin, setGeneratedPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const generateAttendancePin = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 64; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const handleMarkAttendance = async () => {
    if (!attendancePin.trim()) {
      Alert.alert('Error', 'Please enter the attendance PIN');
      return;
    }

    if (attendancePin.length !== 64) {
      Alert.alert('Error', 'Invalid PIN format. PIN must be 64 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation
      const validPin = mockAttendancePins.find(p => p.pin === attendancePin && p.isActive);
      
      if (validPin) {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        Alert.alert('Success', `Attendance marked for ${validPin.className}!`);
        setAttendancePin('');
        setShowPinModal(false);
      } else {
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        Alert.alert('Error', 'Invalid or expired PIN. Please check with your instructor.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to mark attendance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreatePin = async () => {
    if (!selectedClass) {
      Alert.alert('Error', 'Please select a class');
      return;
    }

    const newPin = generateAttendancePin();
    setGeneratedPin(newPin);
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    Alert.alert('Success', 'Attendance PIN generated successfully!');
  };

  const copyToClipboard = async (text: string) => {
    // In a real app, you would use Clipboard API
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert('Copied', 'PIN copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return theme.colors.success;
      case 'late':
        return theme.colors.warning;
      case 'absent':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle size={16} color={theme.colors.success} />;
      case 'late':
        return <Clock size={16} color={theme.colors.warning} />;
      case 'absent':
        return <XCircle size={16} color={theme.colors.error} />;
      default:
        return <Clock size={16} color={theme.colors.textSecondary} />;
    }
  };

  const renderStudentView = () => (
    <>
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowPinModal(true)}
        >
          <Hash size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>{t.markAttendance}</Text>
        </TouchableOpacity>
      </View>

      {/* Attendance History */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t.attendanceHistory}
        </Text>
        
        {mockAttendanceRecords.map((record) => (
          <Animated.View
            key={record.id}
            style={[
              styles.recordCard,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.recordHeader}>
              <View style={styles.recordInfo}>
                {getStatusIcon(record.status)}
                <Text style={[styles.recordTitle, { color: theme.colors.text }]}>
                  {record.className}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(record.status) + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: getStatusColor(record.status) }
                ]}>
                  {record.status.toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.recordDetails}>
              <View style={styles.recordDetail}>
                <Calendar size={14} color={theme.colors.textSecondary} />
                <Text style={[styles.recordDetailText, { color: theme.colors.textSecondary }]}>
                  {new Date(record.date).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.recordDetail}>
                <Clock size={14} color={theme.colors.textSecondary} />
                <Text style={[styles.recordDetailText, { color: theme.colors.textSecondary }]}>
                  {record.time}
                </Text>
              </View>
              
              {record.location && (
                <View style={styles.recordDetail}>
                  <MapPin size={14} color={theme.colors.textSecondary} />
                  <Text style={[styles.recordDetailText, { color: theme.colors.textSecondary }]}>
                    {record.location}
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        ))}
      </View>
    </>
  );

  const renderTeacherView = () => (
    <>
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowCreatePinModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Create PIN</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
        >
          <BarChart3 size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>View Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Active PINs */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Active Attendance PINs
        </Text>
        
        {mockAttendancePins.map((pin) => (
          <Animated.View
            key={pin.id}
            style={[
              styles.pinCard,
              {
                backgroundColor: theme.colors.background,
                borderColor: pin.isActive ? theme.colors.success : theme.colors.border,
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.pinHeader}>
              <View style={styles.pinInfo}>
                <Text style={[styles.pinClassName, { color: theme.colors.text }]}>
                  {pin.className}
                </Text>
                <View style={[
                  styles.pinStatusBadge,
                  { 
                    backgroundColor: pin.isActive 
                      ? theme.colors.success + '20' 
                      : theme.colors.textSecondary + '20' 
                  }
                ]}>
                  <Text style={[
                    styles.pinStatusText,
                    { 
                      color: pin.isActive 
                        ? theme.colors.success 
                        : theme.colors.textSecondary 
                    }
                  ]}>
                    {pin.isActive ? 'ACTIVE' : 'EXPIRED'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.pinDetails}>
              <View style={styles.pinDetail}>
                <Users size={14} color={theme.colors.textSecondary} />
                <Text style={[styles.pinDetailText, { color: theme.colors.textSecondary }]}>
                  {pin.attendanceCount} students marked
                </Text>
              </View>
              
              <View style={styles.pinDetail}>
                <Clock size={14} color={theme.colors.textSecondary} />
                <Text style={[styles.pinDetailText, { color: theme.colors.textSecondary }]}>
                  Expires: {new Date(pin.expiresAt).toLocaleTimeString()}
                </Text>
              </View>
            </View>
            
            <View style={styles.pinActions}>
              <TouchableOpacity
                style={[styles.pinActionButton, { backgroundColor: theme.colors.info + '20' }]}
                onPress={() => copyToClipboard(pin.pin)}
              >
                <Copy size={16} color={theme.colors.info} />
                <Text style={[styles.pinActionText, { color: theme.colors.info }]}>
                  Copy PIN
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.pinActionButton, { backgroundColor: theme.colors.secondary + '20' }]}
              >
                <Share size={16} color={theme.colors.secondary} />
                <Text style={[styles.pinActionText, { color: theme.colors.secondary }]}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}
      </View>
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <LinearGradient
        colors={isDark ? ['#1F2937', '#111827'] : ['#10B981', '#059669']}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <CheckCircle size={24} color="#FFFFFF" />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{t.attendance}</Text>
              <Text style={styles.headerSubtitle}>
                {user?.role === 'student' ? 'Mark your attendance' : 'Manage class attendance'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {user?.role === 'student' ? renderStudentView() : renderTeacherView()}
      </ScrollView>

      {/* PIN Input Modal */}
      <Modal
        visible={showPinModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPinModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPinModal(false)}>
              <Text style={[styles.modalCancelButton, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Mark Attendance
            </Text>
            <TouchableOpacity 
              onPress={handleMarkAttendance}
              disabled={isSubmitting}
            >
              <Text style={[
                styles.modalSubmitButton, 
                { 
                  color: attendancePin.trim() ? theme.colors.primary : theme.colors.textSecondary,
                  opacity: isSubmitting ? 0.5 : 1,
                }
              ]}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={[styles.modalDescription, { color: theme.colors.textSecondary }]}>
              Enter the 64-character PIN provided by your instructor to mark your attendance.
            </Text>
            
            <View style={styles.pinInputContainer}>
              <TextInput
                style={[
                  styles.pinInput,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  }
                ]}
                placeholder="Enter 64-character attendance PIN"
                placeholderTextColor={theme.colors.textSecondary}
                value={attendancePin}
                onChangeText={setAttendancePin}
                multiline
                maxLength={64}
                autoCapitalize="characters"
              />
              <Text style={[styles.pinCounter, { color: theme.colors.textSecondary }]}>
                {attendancePin.length}/64
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create PIN Modal */}
      <Modal
        visible={showCreatePinModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreatePinModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreatePinModal(false)}>
              <Text style={[styles.modalCancelButton, { color: theme.colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Create Attendance PIN
            </Text>
            <TouchableOpacity onPress={handleCreatePin}>
              <Text style={[styles.modalSubmitButton, { color: theme.colors.primary }]}>
                Generate
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={[styles.modalDescription, { color: theme.colors.textSecondary }]}>
              Generate a secure 64-character PIN for students to mark their attendance.
            </Text>
            
            <View style={styles.classSelector}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Select Class
              </Text>
              <TouchableOpacity
                style={[
                  styles.classSelectButton,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                  }
                ]}
                onPress={() => {
                  // In a real app, this would open a class selection modal
                  setSelectedClass('Advanced Mathematics');
                }}
              >
                <Text style={[
                  styles.classSelectText,
                  { color: selectedClass ? theme.colors.text : theme.colors.textSecondary }
                ]}>
                  {selectedClass || 'Choose a class...'}
                </Text>
              </TouchableOpacity>
            </View>

            {generatedPin && (
              <View style={styles.generatedPinContainer}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Generated PIN
                </Text>
                <View style={styles.pinDisplayContainer}>
                  <TextInput
                    style={[
                      styles.pinDisplay,
                      {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      }
                    ]}
                    value={showPin ? generatedPin : '•'.repeat(64)}
                    editable={false}
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.pinToggleButton}
                    onPress={() => setShowPin(!showPin)}
                  >
                    {showPin ? (
                      <EyeOff size={20} color={theme.colors.textSecondary} />
                    ) : (
                      <Eye size={20} color={theme.colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
                
                <View style={styles.pinActions}>
                  <TouchableOpacity
                    style={[styles.pinActionButton, { backgroundColor: theme.colors.info + '20' }]}
                    onPress={() => copyToClipboard(generatedPin)}
                  >
                    <Copy size={16} color={theme.colors.info} />
                    <Text style={[styles.pinActionText, { color: theme.colors.info }]}>
                      Copy PIN
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.pinActionButton, { backgroundColor: theme.colors.secondary + '20' }]}
                  >
                    <Share size={16} color={theme.colors.secondary} />
                    <Text style={[styles.pinActionText, { color: theme.colors.secondary }]}>
                      Share PIN
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recordCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  recordDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  recordDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recordDetailText: {
    fontSize: 12,
  },
  pinCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pinHeader: {
    marginBottom: 12,
  },
  pinInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pinClassName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pinStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pinStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  pinDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  pinDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pinDetailText: {
    fontSize: 12,
  },
  pinActions: {
    flexDirection: 'row',
    gap: 12,
  },
  pinActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  pinActionText: {
    fontSize: 12,
    fontWeight: '600',
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
    borderBottomColor: '#E5E7EB',
  },
  modalCancelButton: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalSubmitButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    padding: 24,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  pinInputContainer: {
    marginBottom: 24,
  },
  pinInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'monospace',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pinCounter: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  classSelector: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  classSelectButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  classSelectText: {
    fontSize: 16,
  },
  generatedPinContainer: {
    marginTop: 24,
  },
  pinDisplayContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  pinDisplay: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 48,
    fontSize: 12,
    fontFamily: 'monospace',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  pinToggleButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
});