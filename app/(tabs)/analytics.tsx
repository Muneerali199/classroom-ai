import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { ChartBar as BarChart3, TrendingUp, Users, Calendar, CircleCheck as CheckCircle, Clock, Award, Download } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface AnalyticsData {
  totalStudents: number;
  totalCourses: number;
  totalActivities: number;
  overallAttendanceRate: number;
  weeklyAttendance: number[];
  monthlyStats: {
    present: number;
    absent: number;
    late: number;
  };
  topPerformers: Array<{
    student_name: string;
    attendance_rate: number;
  }>;
}

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalStudents: 0,
    totalCourses: 0,
    totalActivities: 0,
    overallAttendanceRate: 0,
    weeklyAttendance: [0, 0, 0, 0, 0, 0, 0],
    monthlyStats: { present: 0, absent: 0, late: 0 },
    topPerformers: [],
  });
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(false);

  const role = user?.profile?.role;

  useEffect(() => {
    loadAnalyticsData();
  }, [user, selectedPeriod]);

  const loadAnalyticsData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (role === 'student') {
        await loadStudentAnalytics();
      } else if (role === 'teacher') {
        await loadTeacherAnalytics();
      } else if (role === 'admin') {
        await loadAdminAnalytics();
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStudentAnalytics = async () => {
    // Get student's enrolled courses
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('student_id', user!.id);

    const courseIds = enrollments?.map(e => e.course_id) || [];

    // Get activities for enrolled courses
    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .in('course_id', courseIds);

    // Get attendance records
    const { data: attendance } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', user!.id);

    const totalActivities = activities?.length || 0;
    const attendanceRecords = attendance || [];
    const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
    const attendanceRate = totalActivities > 0 ? (presentCount / totalActivities) * 100 : 0;

    // Calculate monthly stats
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyAttendance = attendanceRecords.filter(a => 
      new Date(a.created_at) >= monthStart
    );

    setAnalyticsData({
      totalStudents: 1, // Student sees only themselves
      totalCourses: courseIds.length,
      totalActivities,
      overallAttendanceRate: Math.round(attendanceRate),
      weeklyAttendance: calculateWeeklyAttendance(attendanceRecords),
      monthlyStats: {
        present: monthlyAttendance.filter(a => a.status === 'present').length,
        absent: monthlyAttendance.filter(a => a.status === 'absent').length,
        late: monthlyAttendance.filter(a => a.status === 'late').length,
      },
      topPerformers: [], // Not applicable for students
    });
  };

  const loadTeacherAnalytics = async () => {
    // Get teacher's courses
    const { data: courses } = await supabase
      .from('courses')
      .select('*')
      .eq('teacher_id', user!.id);

    const courseIds = courses?.map(c => c.id) || [];

    // Get activities for teacher's courses
    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .in('course_id', courseIds);

    const activityIds = activities?.map(a => a.id) || [];

    // Get attendance for teacher's activities
    const { data: attendance } = await supabase
      .from('attendance')
      .select(`
        *,
        profiles!attendance_student_id_fkey (
          full_name
        )
      `)
      .in('activity_id', activityIds);

    // Get unique students
    const uniqueStudentIds = [...new Set(attendance?.map(a => a.student_id) || [])];
    
    const totalActivities = activities?.length || 0;
    const attendanceRecords = attendance || [];
    const presentCount = attendanceRecords.filter(a => a.status === 'present').length;
    const attendanceRate = attendanceRecords.length > 0 ? (presentCount / attendanceRecords.length) * 100 : 0;

    // Calculate top performers
    const studentStats = uniqueStudentIds.map(studentId => {
      const studentAttendance = attendanceRecords.filter(a => a.student_id === studentId);
      const studentPresent = studentAttendance.filter(a => a.status === 'present').length;
      const studentRate = studentAttendance.length > 0 ? (studentPresent / studentAttendance.length) * 100 : 0;
      const studentName = studentAttendance[0]?.profiles?.full_name || 'Unknown';
      
      return {
        student_name: studentName,
        attendance_rate: Math.round(studentRate),
      };
    }).sort((a, b) => b.attendance_rate - a.attendance_rate).slice(0, 5);

    // Calculate monthly stats
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyAttendance = attendanceRecords.filter(a => 
      new Date(a.created_at) >= monthStart
    );

    setAnalyticsData({
      totalStudents: uniqueStudentIds.length,
      totalCourses: courseIds.length,
      totalActivities,
      overallAttendanceRate: Math.round(attendanceRate),
      weeklyAttendance: calculateWeeklyAttendance(attendanceRecords),
      monthlyStats: {
        present: monthlyAttendance.filter(a => a.status === 'present').length,
        absent: monthlyAttendance.filter(a => a.status === 'absent').length,
        late: monthlyAttendance.filter(a => a.status === 'late').length,
      },
      topPerformers: studentStats,
    });
  };

  const loadAdminAnalytics = async () => {
    // Get all data for admin
    const [coursesData, activitiesData, attendanceData, profilesData] = await Promise.all([
      supabase.from('courses').select('*'),
      supabase.from('activities').select('*'),
      supabase.from('attendance').select(`
        *,
        profiles!attendance_student_id_fkey (
          full_name
        )
      `),
      supabase.from('profiles').select('*').eq('role', 'student'),
    ]);

    const courses = coursesData.data || [];
    const activities = activitiesData.data || [];
    const attendance = attendanceData.data || [];
    const students = profilesData.data || [];

    const presentCount = attendance.filter(a => a.status === 'present').length;
    const attendanceRate = attendance.length > 0 ? (presentCount / attendance.length) * 100 : 0;

    // Calculate top performers
    const studentStats = students.map(student => {
      const studentAttendance = attendance.filter(a => a.student_id === student.id);
      const studentPresent = studentAttendance.filter(a => a.status === 'present').length;
      const studentRate = studentAttendance.length > 0 ? (studentPresent / studentAttendance.length) * 100 : 0;
      
      return {
        student_name: student.full_name || 'Unknown',
        attendance_rate: Math.round(studentRate),
      };
    }).sort((a, b) => b.attendance_rate - a.attendance_rate).slice(0, 5);

    // Calculate monthly stats
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyAttendance = attendance.filter(a => 
      new Date(a.created_at) >= monthStart
    );

    setAnalyticsData({
      totalStudents: students.length,
      totalCourses: courses.length,
      totalActivities: activities.length,
      overallAttendanceRate: Math.round(attendanceRate),
      weeklyAttendance: calculateWeeklyAttendance(attendance),
      monthlyStats: {
        present: monthlyAttendance.filter(a => a.status === 'present').length,
        absent: monthlyAttendance.filter(a => a.status === 'absent').length,
        late: monthlyAttendance.filter(a => a.status === 'late').length,
      },
      topPerformers: studentStats,
    });
  };

  const calculateWeeklyAttendance = (attendanceRecords: any[]) => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weeklyData = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat

    attendanceRecords.forEach(record => {
      const recordDate = new Date(record.created_at);
      if (recordDate >= weekStart) {
        const dayIndex = recordDate.getDay();
        if (record.status === 'present') {
          weeklyData[dayIndex]++;
        }
      }
    });

    return weeklyData;
  };

  const exportReport = async () => {
    // Implementation for exporting reports
    // This would typically generate a PDF or CSV file
    console.log('Export report functionality');
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...analyticsData.weeklyAttendance, 1);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Attendance</Text>
        <View style={styles.chart}>
          {analyticsData.weeklyAttendance.map((value, index) => (
            <View key={index} style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (value / maxValue) * 100 || 4,
                    backgroundColor: value > 0 ? '#10B981' : '#E5E7EB',
                  },
                ]}
              />
              <Text style={styles.barLabel}>{days[index]}</Text>
              <Text style={styles.barValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>
          {role === 'student' ? 'Your Performance' : 'Performance Overview'}
        </Text>
        
        <TouchableOpacity style={styles.exportButton} onPress={exportReport}>
          <Download size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.periodSelector}>
        {(['week', 'month', 'year'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive,
              ]}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
            <Users size={24} color="#2563EB" />
            <Text style={styles.statNumber}>{analyticsData.totalStudents}</Text>
            <Text style={styles.statLabel}>
              {role === 'student' ? 'You' : 'Students'}
            </Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F0F9FF' }]}>
            <Calendar size={24} color="#0EA5E9" />
            <Text style={styles.statNumber}>{analyticsData.totalCourses}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
            <CheckCircle size={24} color="#10B981" />
            <Text style={styles.statNumber}>{analyticsData.totalActivities}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FEF3C7' }]}>
            <TrendingUp size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{analyticsData.overallAttendanceRate}%</Text>
            <Text style={styles.statLabel}>Attendance Rate</Text>
          </View>
        </View>

        {renderBarChart()}

        <View style={styles.monthlyStatsContainer}>
          <Text style={styles.sectionTitle}>Monthly Overview</Text>
          <View style={styles.monthlyStats}>
            <View style={styles.monthlyStatItem}>
              <CheckCircle size={20} color="#10B981" />
              <Text style={styles.monthlyStatNumber}>{analyticsData.monthlyStats.present}</Text>
              <Text style={styles.monthlyStatLabel}>Present</Text>
            </View>
            <View style={styles.monthlyStatItem}>
              <Clock size={20} color="#F59E0B" />
              <Text style={styles.monthlyStatNumber}>{analyticsData.monthlyStats.late}</Text>
              <Text style={styles.monthlyStatLabel}>Late</Text>
            </View>
            <View style={styles.monthlyStatItem}>
              <Users size={20} color="#EF4444" />
              <Text style={styles.monthlyStatNumber}>{analyticsData.monthlyStats.absent}</Text>
              <Text style={styles.monthlyStatLabel}>Absent</Text>
            </View>
          </View>
        </View>

        {role !== 'student' && analyticsData.topPerformers.length > 0 && (
          <View style={styles.topPerformersContainer}>
            <Text style={styles.sectionTitle}>Top Performers</Text>
            {analyticsData.topPerformers.map((performer, index) => (
              <View key={index} style={styles.performerItem}>
                <View style={styles.performerRank}>
                  <Award size={16} color="#F59E0B" />
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <Text style={styles.performerName}>{performer.student_name}</Text>
                <Text style={styles.performerRate}>{performer.attendance_rate}%</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    position: 'absolute',
    bottom: 24,
    left: 24,
    marginTop: 4,
  },
  exportButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: -12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    padding: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: '#10B981',
    borderRadius: 2,
    marginBottom: 8,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
  },
  monthlyStatsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  monthlyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthlyStatItem: {
    alignItems: 'center',
  },
  monthlyStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  monthlyStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  topPerformersContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  performerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  performerRank: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 40,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F59E0B',
    marginLeft: 4,
  },
  performerName: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 12,
  },
  performerRate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
});