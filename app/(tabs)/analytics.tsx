import React, { useEffect, useRef } from 'react';
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
  TrendingUp, 
  Users, 
  BookOpen, 
  Award, 
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react-native';

interface AnalyticsCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
  color: [string, string];
}

interface DepartmentData {
  name: string;
  students: number;
  attendance: number;
  gpa: number;
  color: [string, string];
}

const analyticsCards: AnalyticsCard[] = [
  {
    id: '1',
    title: 'Total Students',
    value: '2,847',
    change: '+12%',
    trend: 'up',
    icon: Users,
    color: ['#3B82F6', '#1D4ED8'],
  },
  {
    id: '2',
    title: 'Overall Attendance',
    value: '89.2%',
    change: '+2.1%',
    trend: 'up',
    icon: Calendar,
    color: ['#10B981', '#059669'],
  },
  {
    id: '3',
    title: 'Average GPA',
    value: '3.42',
    change: '+0.15',
    trend: 'up',
    icon: Award,
    color: ['#8B5CF6', '#7C3AED'],
  },
  {
    id: '4',
    title: 'Active Courses',
    value: '124',
    change: '+8',
    trend: 'up',
    icon: BookOpen,
    color: ['#F59E0B', '#D97706'],
  },
];

const departmentData: DepartmentData[] = [
  {
    name: 'Computer Science',
    students: 856,
    attendance: 92,
    gpa: 3.6,
    color: ['#3B82F6', '#1D4ED8'],
  },
  {
    name: 'Engineering',
    students: 742,
    attendance: 88,
    gpa: 3.4,
    color: ['#10B981', '#059669'],
  },
  {
    name: 'Business',
    students: 634,
    attendance: 85,
    gpa: 3.3,
    color: ['#8B5CF6', '#7C3AED'],
  },
  {
    name: 'Arts & Sciences',
    students: 615,
    attendance: 91,
    gpa: 3.5,
    color: ['#F59E0B', '#D97706'],
  },
];

export default function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
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

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return TrendingUp;
      case 'down':
        return Activity;
      default:
        return Activity;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '#10B981';
      case 'down':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
      >
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Institution Analytics</Text>
          <Text style={styles.subtitle}>
            Comprehensive insights and performance metrics
          </Text>
        </Animated.View>

        {/* Key Metrics */}
        <Animated.View
          style={[
            styles.metricsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.metricsGrid}>
            {analyticsCards.map((card, index) => {
              const TrendIcon = getTrendIcon(card.trend);
              return (
                <Animated.View
                  key={card.id}
                  style={[
                    styles.metricCard,
                    {
                      opacity: fadeAnim,
                      transform: [
                        {
                          scale: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']}
                    style={styles.metricCardGradient}
                  >
                    <View style={styles.metricHeader}>
                      <LinearGradient
                        colors={card.color}
                        style={styles.metricIconContainer}
                      >
                        <card.icon color="white" size={20} />
                      </LinearGradient>
                      <View style={styles.metricTrend}>
                        <TrendIcon color={getTrendColor(card.trend)} size={16} />
                      </View>
                    </View>
                    <Text style={styles.metricValue}>{card.value}</Text>
                    <Text style={styles.metricTitle}>{card.title}</Text>
                    <Text style={[styles.metricChange, { color: getTrendColor(card.trend) }]}>
                      {card.change} from last month
                    </Text>
                  </LinearGradient>
                </Animated.View>
              );
            })}
          </View>
        </Animated.View>

        {/* Department Performance */}
        <Animated.View
          style={[
            styles.departmentSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Department Performance</Text>
          {departmentData.map((dept, index) => (
            <Animated.View
              key={dept.name}
              style={[
                styles.departmentCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']}
                style={styles.departmentCardGradient}
              >
                <View style={styles.departmentHeader}>
                  <View style={styles.departmentInfo}>
                    <Text style={styles.departmentName}>{dept.name}</Text>
                    <Text style={styles.departmentStudents}>
                      {dept.students} Students
                    </Text>
                  </View>
                  <LinearGradient
                    colors={dept.color}
                    style={styles.departmentBadge}
                  >
                    <Text style={styles.departmentBadgeText}>
                      {dept.attendance}%
                    </Text>
                  </LinearGradient>
                </View>

                <View style={styles.departmentMetrics}>
                  <View style={styles.departmentMetric}>
                    <Text style={styles.departmentMetricLabel}>Attendance</Text>
                    <View style={styles.departmentProgressBar}>
                      <LinearGradient
                        colors={dept.color}
                        style={[
                          styles.departmentProgressFill,
                          { width: `${dept.attendance}%` },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.departmentMetric}>
                    <Text style={styles.departmentMetricLabel}>
                      Avg GPA: {dept.gpa}
                    </Text>
                    <View style={styles.departmentProgressBar}>
                      <LinearGradient
                        colors={dept.color}
                        style={[
                          styles.departmentProgressFill,
                          { width: `${(dept.gpa / 4) * 100}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.actionsSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                style={styles.actionGradient}
              >
                <BarChart3 color="white" size={24} />
                <Text style={styles.actionText}>Generate Report</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.actionGradient}
              >
                <PieChart color="white" size={24} />
                <Text style={styles.actionText}>View Charts</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  metricsSection: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    marginBottom: 16,
  },
  metricCardGradient: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricTrend: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 11,
    fontWeight: '500',
  },
  departmentSection: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  departmentCard: {
    marginBottom: 16,
  },
  departmentCardGradient: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  departmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  departmentInfo: {
    flex: 1,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  departmentStudents: {
    fontSize: 14,
    color: '#6B7280',
  },
  departmentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  departmentBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  departmentMetrics: {
    gap: 12,
  },
  departmentMetric: {
    gap: 6,
  },
  departmentMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  departmentProgressBar: {
    height: 6,
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  departmentProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  actionsSection: {
    paddingHorizontal: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});