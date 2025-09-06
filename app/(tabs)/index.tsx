import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Users, SquareCheck as CheckSquare, Calendar, TrendingUp, Bell, Clock, Award } from 'lucide-react-native';

interface DashboardStats {
  totalCourses: number;
  totalActivities: number;
  attendanceRate: number;
  upcomingActivities: number;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalActivities: 0,
    attendanceRate: 0,
    upcomingActivities: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const role = user.profile?.role;
      
      // Load stats based on user role
      if (role === 'student') {
        await loadStudentStats();
      } else if (role === 'teacher') {
        await loadTeacherStats();
      } else if (role === 'admin') {
        await loadAdminStats();
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadStudentStats = async () => {
    // Get enrolled courses
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

    const attendanceRate = activities?.length ? 
      (attendance?.filter(a => a.status === 'present').length || 0) / activities.length * 100 : 0;

    // Get upcoming activities
    const upcomingActivities = activities?.filter(a => 
      a.due_date && new Date(a.due_date) > new Date()
    ).length || 0;

    setStats({
      totalCourses: courseIds.length,
      totalActivities: activities?.length || 0,
      attendanceRate: Math.round(attendanceRate),
      upcomingActivities,
    });

    setRecentActivities(activities?.slice(0, 5) || []);
  };

  const loadTeacherStats = async () => {
    // Get courses taught by teacher
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

    // Get all attendance for teacher's activities
    const activityIds = activities?.map(a => a.id) || [];
    const { data: attendance } = await supabase
      .from('attendance')
      .select('*')
      .in('activity_id', activityIds);

    const attendanceRate = attendance?.length ? 
      (attendance?.filter(a => a.status === 'present').length || 0) / attendance.length * 100 : 0;

    // Get upcoming activities
    const upcomingActivities = activities?.filter(a => 
      a.due_date && new Date(a.due_date) > new Date()
    ).length || 0;

    setStats({
      totalCourses: courseIds.length,
      totalActivities: activities?.length || 0,
      attendanceRate: Math.round(attendanceRate),
      upcomingActivities,
    });

    setRecentActivities(activities?.slice(0, 5) || []);
  };

  const loadAdminStats = async () => {
    // Get all courses
    const { data: courses } = await supabase
      .from('courses')
      .select('*');

    // Get all activities
    const { data: activities } = await supabase
      .from('activities')
      .select('*');

    // Get all attendance
    const { data: attendance } = await supabase
      .from('attendance')
      .select('*');

    const attendanceRate = attendance?.length ? 
      (attendance?.filter(a => a.status === 'present').length || 0) / attendance.length * 100 : 0;

    // Get upcoming activities
    const upcomingActivities = activities?.filter(a => 
      a.due_date && new Date(a.due_date) > new Date()
    ).length || 0;

    setStats({
      totalCourses: courses?.length || 0,
      totalActivities: activities?.length || 0,
      attendanceRate: Math.round(attendanceRate),
      upcomingActivities,
    });

    setRecentActivities(activities?.slice(0, 5) || []);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const role = user?.profile?.role;
  const displayName = user?.profile?.full_name || 'User';

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={['#2563EB', '#1D4ED8']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userRole}>
              {role?.charAt(0).toUpperCase() + role?.slice(1)} Dashboard
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Overview</Text>
        
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
            <BookOpen size={24} color="#2563EB" />
            <Text style={styles.statNumber}>{stats.totalCourses}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F0F9FF' }]}>
            <Calendar size={24} color="#0EA5E9" />
            <Text style={styles.statNumber}>{stats.totalActivities}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
            <CheckSquare size={24} color="#10B981" />
            <Text style={styles.statNumber}>{stats.attendanceRate}%</Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FFFBEB' }]}>
            <Clock size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>{stats.upcomingActivities}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.quickActions}>
          {role === 'teacher' && (
            <TouchableOpacity style={styles.actionCard}>
              <Users size={20} color="#2563EB" />
              <Text style={styles.actionText}>Mark Attendance</Text>
            </TouchableOpacity>
          )}
          
          {role === 'student' && (
            <TouchableOpacity style={styles.actionCard}>
              <CheckSquare size={20} color="#10B981" />
              <Text style={styles.actionText}>Check In</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.actionCard}>
            <TrendingUp size={20} color="#F59E0B" />
            <Text style={styles.actionText}>View Reports</Text>
          </TouchableOpacity>

          {role === 'admin' && (
            <TouchableOpacity style={styles.actionCard}>
              <Award size={20} color="#8B5CF6" />
              <Text style={styles.actionText}>Manage Users</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>Recent Activities</Text>
        
        <View style={styles.activitiesList}>
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <View key={activity.id || index} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDate}>
                    {activity.due_date ? 
                      new Date(activity.due_date).toLocaleDateString() : 
                      'No due date'
                    }
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge,
                  activity.status === 'completed' ? styles.completedBadge : styles.activeBadge
                ]}>
                  <Text style={[
                    styles.statusText,
                    activity.status === 'completed' ? styles.completedText : styles.activeText
                  ]}>
                    {activity.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No recent activities</Text>
            </View>
          )}
        </View>
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 2,
  },
  notificationButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
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
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 12,
  },
  activitiesList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  activityDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeBadge: {
    backgroundColor: '#FEF3C7',
  },
  completedBadge: {
    backgroundColor: '#D1FAE5',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  activeText: {
    color: '#D97706',
  },
  completedText: {
    color: '#059669',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
  },
});