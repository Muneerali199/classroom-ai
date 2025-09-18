import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Award,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  BookOpen,
  Target,
  ChevronRight,
} from 'lucide-react-native';

interface Grade {
  id: string;
  course: string;
  assignment: string;
  grade: string;
  points: number;
  maxPoints: number;
  percentage: number;
  date: string;
  type: 'assignment' | 'quiz' | 'exam' | 'project';
  weight: number;
}

interface CourseGrade {
  id: string;
  course: string;
  currentGrade: string;
  percentage: number;
  credits: number;
  instructor: string;
  trend: 'up' | 'down' | 'stable';
  color: [string, string];
}

const mockGrades: Grade[] = [
  {
    id: '1',
    course: 'Advanced Mathematics',
    assignment: 'Midterm Exam',
    grade: 'A-',
    points: 87,
    maxPoints: 100,
    percentage: 87,
    date: '2024-01-15',
    type: 'exam',
    weight: 30,
  },
  {
    id: '2',
    course: 'Data Structures',
    assignment: 'Programming Project 2',
    grade: 'A',
    points: 95,
    maxPoints: 100,
    percentage: 95,
    date: '2024-01-12',
    type: 'project',
    weight: 25,
  },
  {
    id: '3',
    course: 'Statistics',
    assignment: 'Quiz 3',
    grade: 'B+',
    points: 88,
    maxPoints: 100,
    percentage: 88,
    date: '2024-01-10',
    type: 'quiz',
    weight: 10,
  },
  {
    id: '4',
    course: 'Physics',
    assignment: 'Lab Report 4',
    grade: 'A-',
    points: 91,
    maxPoints: 100,
    percentage: 91,
    date: '2024-01-08',
    type: 'assignment',
    weight: 15,
  },
];

const mockCourseGrades: CourseGrade[] = [
  {
    id: '1',
    course: 'Advanced Mathematics',
    currentGrade: 'A-',
    percentage: 89.5,
    credits: 4,
    instructor: 'Dr. Smith',
    trend: 'up',
    color: ['#3B82F6', '#1D4ED8'],
  },
  {
    id: '2',
    course: 'Data Structures',
    currentGrade: 'A',
    percentage: 93.2,
    credits: 3,
    instructor: 'Prof. Johnson',
    trend: 'up',
    color: ['#10B981', '#059669'],
  },
  {
    id: '3',
    course: 'Statistics',
    currentGrade: 'B+',
    percentage: 86.8,
    credits: 3,
    instructor: 'Dr. Wilson',
    trend: 'stable',
    color: ['#8B5CF6', '#7C3AED'],
  },
  {
    id: '4',
    course: 'Physics',
    currentGrade: 'A-',
    percentage: 90.1,
    credits: 4,
    instructor: 'Dr. Brown',
    trend: 'down',
    color: ['#F59E0B', '#D97706'],
  },
];

export default function GradesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'recent' | 'courses'>('overview');
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

  const calculateGPA = () => {
    const totalPoints = mockCourseGrades.reduce((sum, course) => {
      return sum + (course.percentage / 100) * 4 * course.credits;
    }, 0);
    const totalCredits = mockCourseGrades.reduce((sum, course) => sum + course.credits, 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  const getGradeColor = (percentage: number): string => {
    if (percentage >= 90) return '#10B981';
    if (percentage >= 80) return '#3B82F6';
    if (percentage >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return Award;
      case 'project':
        return Target;
      case 'quiz':
        return BookOpen;
      case 'assignment':
        return Calendar;
      default:
        return BookOpen;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return BarChart3;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return '#10B981';
      case 'down':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const stats = [
    { label: 'Current GPA', value: calculateGPA(), icon: Award, color: ['#8B5CF6', '#7C3AED'] as const },
    { label: 'Total Credits', value: '14', icon: BookOpen, color: ['#3B82F6', '#1D4ED8'] as const },
    { label: 'Avg Grade', value: '89.9%', icon: TrendingUp, color: ['#10B981', '#059669'] as const },
    { label: 'Courses', value: '4', icon: Target, color: ['#F59E0B', '#D97706'] as const },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Grades</Text>
          <Text style={styles.headerSubtitle}>
            Academic Performance Overview
          </Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'recent', label: 'Recent' },
            { key: 'courses', label: 'Courses' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                selectedTab === tab.key && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab(tab.key as any)}
            >
              <Text style={[
                styles.tabButtonText,
                selectedTab === tab.key && styles.tabButtonTextActive,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === 'overview' && (
          <>
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

            {/* GPA Trend */}
            <Animated.View
              style={[
                styles.trendSection,
                { opacity: fadeAnim },
              ]}
            >
              <View style={styles.trendCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                  style={styles.trendCardGradient}
                >
                  <View style={styles.trendHeader}>
                    <Text style={styles.trendTitle}>GPA Trend</Text>
                    <TouchableOpacity>
                      <BarChart3 size={20} color="#8B5CF6" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.trendChart}>
                    <Text style={styles.trendDescription}>
                      Your GPA has improved by 0.3 points this semester
                    </Text>
                    <View style={styles.trendIndicator}>
                      <TrendingUp size={16} color="#10B981" />
                      <Text style={styles.trendText}>+8.5% improvement</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </Animated.View>
          </>
        )}

        {selectedTab === 'recent' && (
          <Animated.View
            style={[
              styles.recentSection,
              { opacity: fadeAnim },
            ]}
          >
            <Text style={styles.sectionTitle}>Recent Grades</Text>
            {mockGrades.map((grade, index) => {
              const TypeIcon = getTypeIcon(grade.type);
              return (
                <Animated.View
                  key={grade.id}
                  style={[
                    styles.gradeCard,
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
                    style={styles.gradeCardGradient}
                  >
                    <View style={styles.gradeHeader}>
                      <View style={styles.gradeInfo}>
                        <View style={styles.gradeIconContainer}>
                          <TypeIcon size={16} color={getGradeColor(grade.percentage)} />
                        </View>
                        <View style={styles.gradeDetails}>
                          <Text style={styles.gradeAssignment}>{grade.assignment}</Text>
                          <Text style={styles.gradeCourse}>{grade.course}</Text>
                          <Text style={styles.gradeDate}>
                            {new Date(grade.date).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.gradeScore}>
                        <View style={[
                          styles.gradeBadge,
                          { backgroundColor: getGradeColor(grade.percentage) },
                        ]}>
                          <Text style={styles.gradeText}>{grade.grade}</Text>
                        </View>
                        <Text style={styles.gradePercentage}>
                          {grade.points}/{grade.maxPoints}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.gradeProgress}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${grade.percentage}%`,
                              backgroundColor: getGradeColor(grade.percentage),
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{grade.percentage}%</Text>
                    </View>
                  </LinearGradient>
                </Animated.View>
              );
            })}
          </Animated.View>
        )}

        {selectedTab === 'courses' && (
          <Animated.View
            style={[
              styles.coursesSection,
              { opacity: fadeAnim },
            ]}
          >
            <Text style={styles.sectionTitle}>Course Grades</Text>
            {mockCourseGrades.map((course, index) => {
              const TrendIcon = getTrendIcon(course.trend);
              return (
                <Animated.View
                  key={course.id}
                  style={[
                    styles.courseCard,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateY: slideAnim }],
                    },
                  ]}
                >
                  <TouchableOpacity activeOpacity={0.8}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                      style={styles.courseCardGradient}
                    >
                      <View style={styles.courseHeader}>
                        <View style={styles.courseInfo}>
                          <LinearGradient
                            colors={course.color}
                            style={styles.courseIcon}
                          >
                            <BookOpen size={16} color="#FFFFFF" />
                          </LinearGradient>
                          <View style={styles.courseDetails}>
                            <Text style={styles.courseName}>{course.course}</Text>
                            <Text style={styles.courseInstructor}>{course.instructor}</Text>
                            <Text style={styles.courseCredits}>{course.credits} Credits</Text>
                          </View>
                        </View>
                        <View style={styles.courseGrade}>
                          <View style={styles.gradeTrend}>
                            <TrendIcon size={16} color={getTrendColor(course.trend)} />
                          </View>
                          <View style={[
                            styles.courseGradeBadge,
                            { backgroundColor: getGradeColor(course.percentage) },
                          ]}>
                            <Text style={styles.courseGradeText}>{course.currentGrade}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={styles.courseProgress}>
                        <View style={styles.courseProgressBar}>
                          <LinearGradient
                            colors={course.color}
                            style={[
                              styles.courseProgressFill,
                              { width: `${course.percentage}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.coursePercentage}>{course.percentage}%</Text>
                      </View>
                      <View style={styles.courseFooter}>
                        <Text style={styles.viewDetailsText}>View Details</Text>
                        <ChevronRight size={16} color="#6B7280" />
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </Animated.View>
        )}
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
    marginBottom: 20,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
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
  trendSection: {
    marginBottom: 24,
  },
  trendCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  trendCardGradient: {
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  trendChart: {
    alignItems: 'center',
  },
  trendDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 12,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginLeft: 4,
  },
  recentSection: {
    marginTop: 16,
  },
  coursesSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  gradeCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradeCardGradient: {
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gradeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gradeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gradeDetails: {
    flex: 1,
  },
  gradeAssignment: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  gradeCourse: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  gradeDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  gradeScore: {
    alignItems: 'center',
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  gradeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gradePercentage: {
    fontSize: 12,
    color: '#6B7280',
  },
  gradeProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  courseCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  courseCardGradient: {
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  courseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  courseDetails: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  courseCredits: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  courseGrade: {
    alignItems: 'center',
  },
  gradeTrend: {
    marginBottom: 8,
  },
  courseGradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  courseGradeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  courseProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  courseProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  courseProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  coursePercentage: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
});