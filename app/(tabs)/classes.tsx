import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
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
} from 'lucide-react-native';

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
  color: [string, string];
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
    color: ['#3B82F6', '#1D4ED8'],
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
    color: ['#10B981', '#059669'],
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
    color: ['#8B5CF6', '#7C3AED'],
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
    color: ['#F59E0B', '#D97706'],
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
  }, []);

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
    { label: 'Total Classes', value: mockClasses.length.toString(), icon: BookOpen, color: ['#3B82F6', '#1D4ED8'] },
    { label: 'Total Students', value: mockClasses.reduce((sum, c) => sum + c.students, 0).toString(), icon: Users, color: ['#10B981', '#059669'] },
    { label: 'Avg Attendance', value: `${Math.round(mockClasses.reduce((sum, c) => sum + c.averageAttendance, 0) / mockClasses.length)}%`, icon: Calendar, color: ['#8B5CF6', '#7C3AED'] },
    { label: 'Avg Grade', value: `${Math.round(mockClasses.reduce((sum, c) => sum + c.averageGrade, 0) / mockClasses.length)}%`, icon: Award, color: ['#F59E0B', '#D97706'] },
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
});