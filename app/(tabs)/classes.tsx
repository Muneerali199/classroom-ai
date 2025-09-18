import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  BarChart3,
  Plus,
  Settings,
  ChevronRight,
  Activity,
  Award,
  Camera,
  Bell,
  MessageCircle,
  AlertTriangle,
  Zap,
  Wifi,
  WifiOff,
  Send,
} from 'lucide-react-native';
import { Camera as ExpoCamera } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

interface ClassData {
  id: string;
  name: string;
  code: string;
  schedule: string;
  location: string;
  students: number;
  maxStudents: number;
  averageAttendance: number;
  averageGrade: number;
  nextClass: string;
  color: readonly [string, string];
}

interface StudentData {
  id: string;
  name: string;
  studentId: string;
  attendance: number;
  grade: number;
  lastSeen: string;
}

const mockClasses: ClassData[] = [
  {
    id: '1',
    name: 'Advanced Mathematics',
    code: 'MATH301',
    schedule: 'Mon, Wed, Fri 9:00-10:30 AM',
    location: 'Room 101',
    students: 28,
    maxStudents: 30,
    averageAttendance: 92,
    averageGrade: 87.5,
    nextClass: '2024-01-16T09:00:00',
    color: ['#3B82F6', '#1D4ED8'] as const,
  },
  {
    id: '2',
    name: 'Calculus II',
    code: 'MATH201',
    schedule: 'Tue, Thu 11:00 AM-12:30 PM',
    location: 'Room 102',
    students: 25,
    maxStudents: 30,
    averageAttendance: 88,
    averageGrade: 84.2,
    nextClass: '2024-01-16T11:00:00',
    color: ['#10B981', '#059669'] as const,
  },
  {
    id: '3',
    name: 'Statistics',
    code: 'STAT301',
    schedule: 'Mon, Wed 2:00-3:30 PM',
    location: 'Room 201',
    students: 35,
    maxStudents: 40,
    averageAttendance: 85,
    averageGrade: 82.8,
    nextClass: '2024-01-15T14:00:00',
    color: ['#8B5CF6', '#7C3AED'] as const,
  },
  {
    id: '4',
    name: 'Linear Algebra',
    code: 'MATH401',
    schedule: 'Tue, Thu 3:00-4:30 PM',
    location: 'Room 301',
    students: 22,
    maxStudents: 25,
    averageAttendance: 95,
    averageGrade: 89.1,
    nextClass: '2024-01-16T15:00:00',
    color: ['#F59E0B', '#D97706'] as const,
  },
];

const mockStudents: StudentData[] = [
  {
    id: '1',
    name: 'John Smith',
    studentId: 'CS2024001',
    attendance: 95,
    grade: 92,
    lastSeen: '2024-01-15',
  },
  {
    id: '2',
    name: 'Emily Johnson',
    studentId: 'CS2024002',
    attendance: 88,
    grade: 87,
    lastSeen: '2024-01-15',
  },
  {
    id: '3',
    name: 'Michael Brown',
    studentId: 'CS2024003',
    attendance: 92,
    grade: 89,
    lastSeen: '2024-01-14',
  },
];

export default function ClassesScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [showStudents, setShowStudents] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Real-time features state
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{id: string, sender: string, message: string, timestamp: Date}[]>([]);
  const [isOnline] = useState(true);
  const [notifications, setNotifications] = useState<{id: string, title: string, message: string, type: 'info' | 'warning' | 'alert', timestamp: Date}[]>([]);
  const [aiInsights, setAiInsights] = useState<{attendancePrediction: string, performanceInsights: string, recommendations: string[]}>( {
    attendancePrediction: '',
    performanceInsights: '',
    recommendations: []
  });

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

    // Initialize real-time features
    initializePermissions();
    setupNotifications();
    getCurrentLocation();
    generateAIInsights();
    simulateRealTimeUpdates();
  }, [fadeAnim, slideAnim]);

  const initializePermissions = async () => {
    const { status } = await ExpoCamera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please enable notifications for real-time updates.');
    }
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      // Location data can be used for class proximity detection or other features
      console.log('Current location:', location);
    }
  };

  const generateAIInsights = () => {
    setAiInsights({
      attendancePrediction: 'Expected attendance: 89% (based on weather and historical data)',
      performanceInsights: 'Class performance trending upward. Focus on advanced topics.',
      recommendations: [
        'Schedule review session for struggling students',
        'Implement peer learning groups',
        'Add interactive quizzes for better engagement'
      ]
    });
  };

  const simulateRealTimeUpdates = () => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const randomNotifications = [
        { id: Date.now().toString(), title: 'Class Update', message: 'New assignment posted', type: 'info' as const, timestamp: new Date() },
        { id: (Date.now() + 1).toString(), title: 'Attendance Alert', message: 'Low attendance detected', type: 'warning' as const, timestamp: new Date() },
      ];
      setNotifications(prev => [...prev, ...randomNotifications].slice(-5)); // Keep last 5
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  };

  const takeAttendance = async () => {
    if (!hasPermission) {
      Alert.alert('Camera permission required', 'Please enable camera access to take attendance.');
      return;
    }

    try {
      // Simulate face recognition and attendance marking
      setTimeout(() => {
        Alert.alert('Attendance Taken', 'Successfully marked attendance for 25 students.');
      }, 3000);
    } catch {
      Alert.alert('Error', 'Failed to take attendance. Please try again.');
    }
  };

  const sendEmergencyAlert = () => {
    Alert.alert(
      'Emergency Alert Sent',
      'Emergency services and school administration have been notified.',
      [{ text: 'OK' }]
    );

    // Send notification to all students
    const emergencyNotification = {
      id: Date.now().toString(),
      title: 'EMERGENCY ALERT',
      message: 'Emergency situation reported. Stay in place and follow instructions.',
      type: 'alert' as const,
      timestamp: new Date()
    };
    setNotifications(prev => [emergencyNotification, ...prev]);
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: user?.name || 'Teacher',
        message: chatMessage,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setChatMessage('');
    }
  };

  const getAttendanceColor = (attendance: number): string => {
    if (attendance >= 90) return '#10B981';
    if (attendance >= 80) return '#3B82F6';
    if (attendance >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getGradeColor = (grade: number): string => {
    if (grade >= 90) return '#10B981';
    if (grade >= 80) return '#3B82F6';
    if (grade >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const handleClassPress = (classData: ClassData) => {
    setSelectedClass(classData);
    setShowStudents(true);
  };

  const handleCreateClass = () => {
    Alert.alert(
      'Create New Class',
      'This feature would open a form to create a new class.',
      [{ text: 'OK' }]
    );
  };

  const stats = [
    { label: 'Total Classes', value: mockClasses.length.toString(), icon: BookOpen, color: ['#3B82F6', '#1D4ED8'] as const },
    { label: 'Total Students', value: mockClasses.reduce((sum, c) => sum + c.students, 0).toString(), icon: Users, color: ['#10B981', '#059669'] as const },
    { label: 'Avg Attendance', value: `${Math.round(mockClasses.reduce((sum, c) => sum + c.averageAttendance, 0) / mockClasses.length)}%`, icon: Calendar, color: ['#8B5CF6', '#7C3AED'] as const },
    { label: 'Avg Grade', value: `${Math.round(mockClasses.reduce((sum, c) => sum + c.averageGrade, 0) / mockClasses.length)}%`, icon: Award, color: ['#F59E0B', '#D97706'] as const },
  ];

  if (showStudents && selectedClass) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={selectedClass.color}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowStudents(false)}
            >
              <ChevronRight size={24} color="#FFFFFF" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>{selectedClass.name}</Text>
              <Text style={styles.headerSubtitle}>
                {selectedClass.code} • {selectedClass.students} Students
              </Text>
            </View>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Real-time Status Bar */}
          <View style={styles.statusBar}>
            <View style={styles.statusItem}>
              {isOnline ? <Wifi size={16} color="#10B981" /> : <WifiOff size={16} color="#EF4444" />}
              <Text style={[styles.statusText, { color: isOnline ? '#10B981' : '#EF4444' }]}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
            <TouchableOpacity style={styles.emergencyButton} onPress={sendEmergencyAlert}>
              <AlertTriangle size={16} color="#FFFFFF" />
              <Text style={styles.emergencyText}>Emergency</Text>
            </TouchableOpacity>
          </View>

          {/* AI Insights */}
          <Animated.View style={[styles.insightsSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>AI Insights</Text>
            <LinearGradient colors={['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.05)']} style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Zap size={20} color="#8B5CF6" />
                <Text style={styles.insightTitle}>Smart Predictions</Text>
              </View>
              <Text style={styles.insightText}>{aiInsights.attendancePrediction}</Text>
              <Text style={styles.insightText}>{aiInsights.performanceInsights}</Text>
              <View style={styles.recommendations}>
                <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                {aiInsights.recommendations.map((rec, index) => (
                  <Text key={index} style={styles.recommendationText}>• {rec}</Text>
                ))}
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View style={[styles.actionsSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={takeAttendance}>
                <LinearGradient colors={['#10B981', '#059669']} style={styles.actionGradient}>
                  <Camera size={20} color="#FFFFFF" />
                  <Text style={styles.actionText}>Take Attendance</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => setShowChat(true)}>
                <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.actionGradient}>
                  <MessageCircle size={20} color="#FFFFFF" />
                  <Text style={styles.actionText}>Class Chat</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Notifications */}
          {notifications.length > 0 && (
            <Animated.View style={[styles.notificationsSection, { opacity: fadeAnim }]}>
              <Text style={styles.sectionTitle}>Recent Notifications</Text>
              {notifications.slice(0, 3).map((notification) => (
                <LinearGradient
                  key={notification.id}
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                  style={styles.notificationCard}
                >
                  <View style={styles.notificationHeader}>
                    <Bell size={16} color={
                      notification.type === 'alert' ? '#EF4444' :
                      notification.type === 'warning' ? '#F59E0B' : '#3B82F6'
                    } />
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                  </View>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>
                    {notification.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </LinearGradient>
              ))}
            </Animated.View>
          )}

          <Animated.View style={[styles.studentsSection, { opacity: fadeAnim }]}>
            <Text style={styles.sectionTitle}>Students</Text>
            {mockStudents.map((student, index) => (
              <Animated.View
                key={student.id}
                style={[
                  styles.studentCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                  style={styles.studentCardGradient}
                >
                  <View style={styles.studentInfo}>
                    <View style={styles.studentAvatar}>
                      <Text style={styles.studentInitials}>
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </Text>
                    </View>
                    <View style={styles.studentDetails}>
                      <Text style={styles.studentName}>{student.name}</Text>
                      <Text style={styles.studentId}>{student.studentId}</Text>
                      <Text style={styles.studentLastSeen}>
                        Last seen: {new Date(student.lastSeen).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.studentMetrics}>
                    <View style={styles.studentMetric}>
                      <Text style={styles.metricLabel}>Attendance</Text>
                      <View style={styles.metricValue}>
                        <Text style={[
                          styles.metricNumber,
                          { color: getAttendanceColor(student.attendance) }
                        ]}>
                          {student.attendance}%
                        </Text>
                        <View style={styles.metricBar}>
                          <View
                            style={[
                              styles.metricBarFill,
                              {
                                width: `${student.attendance}%`,
                                backgroundColor: getAttendanceColor(student.attendance),
                              },
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                    <View style={styles.studentMetric}>
                      <Text style={styles.metricLabel}>Grade</Text>
                      <View style={styles.metricValue}>
                        <Text style={[
                          styles.metricNumber,
                          { color: getGradeColor(student.grade) }
                        ]}>
                          {student.grade}%
                        </Text>
                        <View style={styles.metricBar}>
                          <View
                            style={[
                              styles.metricBarFill,
                              {
                                width: `${student.grade}%`,
                                backgroundColor: getGradeColor(student.grade),
                              },
                            ]}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </Animated.View>
            ))}
          </Animated.View>
        </ScrollView>

        {/* Chat Modal */}
        <Modal visible={showChat} animationType="slide" transparent={true}>
          <View style={styles.chatModal}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.chatHeader}>
              <TouchableOpacity onPress={() => setShowChat(false)}>
                <ChevronRight size={24} color="#FFFFFF" style={{ transform: [{ rotate: '180deg' }] }} />
              </TouchableOpacity>
              <Text style={styles.chatTitle}>Class Chat</Text>
              <View style={styles.chatStatus}>
                <View style={[styles.onlineIndicator, { backgroundColor: isOnline ? '#10B981' : '#EF4444' }]} />
                <Text style={styles.chatStatusText}>{isOnline ? '25 online' : 'Offline'}</Text>
              </View>
            </LinearGradient>

            <ScrollView style={styles.chatMessages}>
              {chatMessages.map((msg) => (
                <View key={msg.id} style={styles.chatMessage}>
                  <Text style={styles.messageSender}>{msg.sender}</Text>
                  <Text style={styles.messageText}>{msg.message}</Text>
                  <Text style={styles.messageTime}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.chatInput}>
              <TextInput
                style={styles.chatTextInput}
                placeholder="Type a message..."
                value={chatMessage}
                onChangeText={setChatMessage}
                multiline
              />
              <TouchableOpacity style={styles.sendButton} onPress={sendChatMessage}>
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>My Classes</Text>
            <Text style={styles.headerSubtitle}>
              Teaching {mockClasses.length} courses this semester
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateClass}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <Animated.View
          style={[
            styles.statsContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {stats.map((stat, index) => (
            <View key={stat.label} style={styles.statCard}>
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.statCardGradient}
              >
                <LinearGradient
                  colors={stat.color}
                  style={styles.statIcon}
                >
                  <stat.icon size={20} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </LinearGradient>
            </View>
          ))}
        </Animated.View>

        {/* Classes List */}
        <Animated.View
          style={[
            styles.classesSection,
            { opacity: fadeAnim },
          ]}
        >
          <Text style={styles.sectionTitle}>Your Classes</Text>
          {mockClasses.map((classData, index) => (
            <Animated.View
              key={classData.id}
              style={[
                styles.classCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleClassPress(classData)}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                  style={styles.classCardGradient}
                >
                  <View style={styles.classHeader}>
                    <View style={styles.classInfo}>
                      <LinearGradient
                        colors={classData.color}
                        style={styles.classIcon}
                      >
                        <BookOpen size={20} color="#FFFFFF" />
                      </LinearGradient>
                      <View style={styles.classDetails}>
                        <Text style={styles.className}>{classData.name}</Text>
                        <Text style={styles.classCode}>{classData.code}</Text>
                        <View style={styles.classSchedule}>
                          <Clock size={12} color="#6B7280" />
                          <Text style={styles.classScheduleText}>{classData.schedule}</Text>
                        </View>
                        <View style={styles.classLocation}>
                          <MapPin size={12} color="#6B7280" />
                          <Text style={styles.classLocationText}>{classData.location}</Text>
                        </View>
                      </View>
                    </View>
                    <ChevronRight size={20} color="#6B7280" />
                  </View>

                  <View style={styles.classMetrics}>
                    <View style={styles.classMetric}>
                      <View style={styles.metricHeader}>
                        <Users size={14} color="#6B7280" />
                        <Text style={styles.metricTitle}>Students</Text>
                      </View>
                      <Text style={styles.metricValue}>
                        {classData.students}/{classData.maxStudents}
                      </Text>
                      <View style={styles.metricBar}>
                        <View
                          style={[
                            styles.metricBarFill,
                            {
                              width: `${(classData.students / classData.maxStudents) * 100}%`,
                              backgroundColor: classData.color[0],
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={styles.classMetric}>
                      <View style={styles.metricHeader}>
                        <Activity size={14} color="#6B7280" />
                        <Text style={styles.metricTitle}>Attendance</Text>
                      </View>
                      <Text style={[
                        styles.metricValue,
                        { color: getAttendanceColor(classData.averageAttendance) }
                      ]}>
                        {classData.averageAttendance}%
                      </Text>
                      <View style={styles.metricBar}>
                        <View
                          style={[
                            styles.metricBarFill,
                            {
                              width: `${classData.averageAttendance}%`,
                              backgroundColor: getAttendanceColor(classData.averageAttendance),
                            },
                          ]}
                        />
                      </View>
                    </View>

                    <View style={styles.classMetric}>
                      <View style={styles.metricHeader}>
                        <BarChart3 size={14} color="#6B7280" />
                        <Text style={styles.metricTitle}>Avg Grade</Text>
                      </View>
                      <Text style={[
                        styles.metricValue,
                        { color: getGradeColor(classData.averageGrade) }
                      ]}>
                        {classData.averageGrade}%
                      </Text>
                      <View style={styles.metricBar}>
                        <View
                          style={[
                            styles.metricBarFill,
                            {
                              width: `${classData.averageGrade}%`,
                              backgroundColor: getGradeColor(classData.averageGrade),
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>

                  <View style={styles.classFooter}>
                    <Text style={styles.nextClassText}>
                      Next class: {new Date(classData.nextClass).toLocaleDateString()} at {new Date(classData.nextClass).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
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
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: -15,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
  },
  statCardGradient: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  classesSection: {
    marginBottom: 24,
  },
  studentsSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  classCard: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  classCardGradient: {
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  classInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  classIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  classDetails: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  classCode: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  classSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  classScheduleText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  classLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classLocationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  classMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  classMetric: {
    flex: 1,
    marginHorizontal: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  classFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  nextClassText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  studentCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  studentCardGradient: {
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  studentInitials: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  studentId: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  studentLastSeen: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  studentMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studentMetric: {
    flex: 1,
    marginHorizontal: 8,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  insightsSection: {
    marginBottom: 24,
  },
  insightCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  insightText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  recommendations: {
    marginTop: 12,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 18,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionGradient: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  notificationsSection: {
    marginBottom: 24,
  },
  notificationCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 16,
  },
  notificationTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  chatModal: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
    flex: 1,
  },
  chatStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  chatStatusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  chatMessages: {
    flex: 1,
    padding: 16,
  },
  chatMessage: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  chatTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
