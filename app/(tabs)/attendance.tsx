import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { SquareCheck as CheckSquare, QrCode, MapPin, Clock, Users, Calendar, CircleCheck as CheckCircle, Circle as XCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

interface AttendanceRecord {
  id: string;
  student_id: string;
  activity_id: string;
  status: 'present' | 'absent' | 'late';
  check_in_time: string | null;
  location: string | null;
  created_at: string;
  activity_title?: string;
  student_name?: string;
}

interface Activity {
  id: string;
  title: string;
  due_date: string;
}

interface Profile {
  full_name: string;
}

interface AttendanceWithRelations {
  id: string;
  student_id: string;
  activity_id: string;
  status: 'present' | 'absent' | 'late';
  check_in_time: string | null;
  location: string | null;
  created_at: string;
  activities?: Activity;
  profiles?: Profile;
}

export default function AttendanceScreen() {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  const role = user?.user_metadata?.role || user?.app_metadata?.role;

  useEffect(() => {
    loadAttendanceData();
  }, [user]);

  const loadAttendanceData = async () => {
    if (!user) return;

    try {
      if (role === 'student') {
        // Load student's attendance records
        const { data, error } = await supabase
          .from('attendance')
          .select(`
            *,
            activities (
              title,
              due_date
            )
          `)
          .eq('student_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const records = (data as AttendanceWithRelations[]).map(record => ({
          ...record,
          activity_title: record.activities?.title || 'Unknown Activity',
        }));

        setAttendanceRecords(records);
      } else if (role === 'teacher') {
        // Load attendance for teacher's activities
        const { data: courses, error: coursesError } = await supabase
          .from('courses')
          .select('id')
          .eq('teacher_id', user.id);

        if (coursesError) throw coursesError;

        const courseIds = courses?.map(c => c.id) || [];

        const { data: activities, error: activitiesError } = await supabase
          .from('activities')
          .select('id')
          .in('course_id', courseIds);

        if (activitiesError) throw activitiesError;

        const activityIds = activities?.map(a => a.id) || [];

        const { data, error } = await supabase
          .from('attendance')
          .select(`
            *,
            activities (
              title,
              due_date
            ),
            profiles!attendance_student_id_fkey (
              full_name
            )
          `)
          .in('activity_id', activityIds)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const records = (data as AttendanceWithRelations[]).map(record => ({
          ...record,
          activity_title: record.activities?.title || 'Unknown Activity',
          student_name: record.profiles?.full_name || 'Unknown Student',
        }));

        setAttendanceRecords(records);
      } else if (role === 'admin') {
        // Load all attendance records
        const { data, error } = await supabase
          .from('attendance')
          .select(`
            *,
            activities (
              title,
              due_date
            ),
            profiles!attendance_student_id_fkey (
              full_name
            )
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;

        const records = (data as AttendanceWithRelations[]).map(record => ({
          ...record,
          activity_title: record.activities?.title || 'Unknown Activity',
          student_name: record.profiles?.full_name || 'Unknown Student',
        }));

        setAttendanceRecords(records);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      Alert.alert('Error', 'Failed to load attendance data');
    }
  };

  const requestPermissions = async () => {
    // For now, we'll just set permission to false since we removed barcode scanner
    // You can implement camera permissions if you want to use a different QR scanner
    setHasPermission(false);
    Alert.alert('Info', 'QR scanning functionality requires a barcode scanner package. Please install one or use manual check-in.');
  };

  const handleQRScan = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setShowScanner(false);
    
    // Parse QR code data (should contain activity ID)
    try {
      const activityId = data; // Assuming QR contains activity ID
      markAttendanceByQR(activityId);
    } catch (error) {
      Alert.alert('Error', 'Invalid QR code');
    }
  };

  const markAttendanceByQR = async (activityId: string) => {
    if (!user) return;

    try {
      // Get location if permission granted
      let location = null;
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        location = `${currentLocation.coords.latitude},${currentLocation.coords.longitude}`;
      }

      const { error } = await supabase
        .from('attendance')
        .insert({
          student_id: user.id,
          activity_id: activityId,
          status: 'present',
          check_in_time: new Date().toISOString(),
          location,
        } as any);

      if (error) throw error;

      Alert.alert('Success', 'Attendance marked successfully!');
      loadAttendanceData();
    } catch (error) {
      console.error('Error marking attendance:', error);
      Alert.alert('Error', 'Failed to mark attendance');
    }
  };

  const handleManualCheckIn = async () => {
    Alert.alert(
      'Manual Check-in',
      'This feature requires activity selection. Would you like to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => {
          // Navigate to activity selection or implement manual check-in
          Alert.alert('Info', 'Manual check-in implementation needed');
        }}
      ]
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle size={16} color="#10B981" />;
      case 'late':
        return <AlertCircle size={16} color="#F59E0B" />;
      case 'absent':
        return <XCircle size={16} color="#EF4444" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#10B981';
      case 'late':
        return '#F59E0B';
      case 'absent':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Attendance</Text>
        <Text style={styles.headerSubtitle}>
          Track and manage attendance
        </Text>
      </LinearGradient>

      {role === 'student' && (
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              requestPermissions();
              setShowScanner(true);
              setScanned(false);
            }}
          >
            <QrCode size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Scan QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleManualCheckIn}
          >
            <MapPin size={20} color="#10B981" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>
              Manual Check-in
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content}>
        <View style={styles.recordsList}>
          {attendanceRecords.length > 0 ? (
            attendanceRecords.map((record) => (
              <View key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View style={styles.recordTitleSection}>
                    {getStatusIcon(record.status)}
                    <Text style={styles.recordTitle}>
                      {record.activity_title}
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
                      {record.status}
                    </Text>
                  </View>
                </View>

                {role !== 'student' && record.student_name && (
                  <View style={styles.recordInfo}>
                    <Users size={14} color="#6B7280" />
                    <Text style={styles.recordInfoText}>
                      Student: {record.student_name}
                    </Text>
                  </View>
                )}

                {record.check_in_time && (
                  <View style={styles.recordInfo}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.recordInfoText}>
                      Check-in: {new Date(record.check_in_time).toLocaleString()}
                    </Text>
                  </View>
                )}

                {record.location && (
                  <View style={styles.recordInfo}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.recordInfoText}>
                      Location: {record.location}
                    </Text>
                  </View>
                )}

                <View style={styles.recordInfo}>
                  <Calendar size={14} color="#6B7280" />
                  <Text style={styles.recordInfoText}>
                    Recorded: {new Date(record.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <CheckSquare size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No attendance records</Text>
              <Text style={styles.emptyText}>
                {role === 'student' 
                  ? 'Start checking in to activities to see your attendance history'
                  : 'Attendance records will appear here once students start checking in'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showScanner}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.scannerContainer}>
          {hasPermission === null ? (
            <Text>Requesting camera permission...</Text>
          ) : hasPermission === false ? (
            <View style={styles.permissionDenied}>
              <Text style={styles.permissionText}>
                Camera permission is required to scan QR codes
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={requestPermissions}
              >
                <Text style={styles.permissionButtonText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Text style={styles.cameraPlaceholderText}>
                Camera view would appear here
              </Text>
              <Text style={styles.cameraPlaceholderSubtext}>
                Install a barcode scanner package to enable QR scanning
              </Text>
            </View>
          )}
          
          <View style={styles.scannerOverlay}>
            <TouchableOpacity
              style={styles.closeScanner}
              onPress={() => setShowScanner(false)}
            >
              <Text style={styles.closeScannerText}>Close</Text>
            </TouchableOpacity>
            
            <View style={styles.scannerInstructions}>
              <Text style={styles.scannerText}>
                QR scanning requires additional setup
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#D1FAE5',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#10B981',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  recordsList: {
    paddingBottom: 24,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recordTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  recordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordInfoText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 32,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  closeScanner: {
    position: 'absolute',
    top: 60,
    right: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeScannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  scannerInstructions: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scannerText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  permissionDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  permissionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cameraPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  cameraPlaceholderText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  cameraPlaceholderSubtext: {
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
  },
});