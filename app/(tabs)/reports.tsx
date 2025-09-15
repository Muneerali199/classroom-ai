import React, { useEffect, useRef, useState } from 'react';
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
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Download,
  Calendar,
  Users,
  Clock,
  Award,
  FileText,
  Filter
} from 'lucide-react-native';

interface ReportCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: [string, string];
  data: string;
}

interface ClassReport {
  className: string;
  totalStudents: number;
  averageAttendance: number;
  averageGrade: number;
  lastUpdated: string;
}

const reportCards: ReportCard[] = [
  {
    id: '1',
    title: 'Attendance Report',
    description: 'Weekly attendance summary',
    icon: Users,
    color: ['#3B82F6', '#1D4ED8'],
    data: '89.2%',
  },
  {
    id: '2',
    title: 'Grade Distribution',
    description: 'Student performance analysis',
    icon: Award,
    color: ['#10B981', '#059669'],
    data: '3.4 GPA',
  },
  {
    id: '3',
    title: 'Class Performance',
    description: 'Overall class metrics',
    icon: TrendingUp,
    color: ['#8B5CF6', '#7C3AED'],
    data: '+12%',
  },
  {
    id: '4',
    title: 'Time Analytics',
    description: 'Teaching hours breakdown',
    icon: Clock,
    color: ['#F59E0B', '#D97706'],
    data: '24h/week',
  },
];

const classReports: ClassReport[] = [
  {
    className: 'Advanced Mathematics',
    totalStudents: 30,
    averageAttendance: 92,
    averageGrade: 3.6,
    lastUpdated: '2024-01-15',
  },
  {
    className: 'Calculus II',
    totalStudents: 25,
    averageAttendance: 88,
    averageGrade: 3.4,
    lastUpdated: '2024-01-15',
  },
  {
    className: 'Statistics',
    totalStudents: 35,
    averageAttendance: 85,
    averageGrade: 3.2,
    lastUpdated: '2024-01-14',
  },
  {
    className: 'Linear Algebra',
    totalStudents: 28,
    averageAttendance: 90,
    averageGrade: 3.5,
    lastUpdated: '2024-01-14',
  },
];

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('week');

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

  const getGradeColor = (grade: number): [string, string] => {
    if (grade >= 3.5) return ['#10B981', '#059669'];
    if (grade >= 3.0) return ['#3B82F6', '#1D4ED8'];
    if (grade >= 2.5) return ['#F59E0B', '#D97706'];
    return ['#EF4444', '#DC2626'];
  };

  const getAttendanceColor = (attendance: number): [string, string] => {
    if (attendance >= 90) return ['#10B981', '#059669'];
    if (attendance >= 80) return ['#3B82F6', '#1D4ED8'];
    if (attendance >= 70) return ['#F59E0B', '#D97706'];
    return ['#EF4444', '#DC2626'];
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
          <Text style={styles.title}>Teaching Reports</Text>
          <Text style={styles.subtitle}>
            Analyze your class performance and student progress
          </Text>
        </Animated.View>

        {/* Period Filter */}
        <Animated.View
          style={[
            styles.filterContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.periodButtons}>
            {(['week', 'month', 'semester'] as const).map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive,
                ]}
                onPress={() => setSelectedPeriod(period)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={selectedPeriod === period ? ['#3B82F6', '#1D4ED8'] : ['transparent', 'transparent']}
                  style={styles.periodButtonGradient}
                >
                  <Text style={[
                    styles.periodButtonText,
                    selectedPeriod === period && styles.periodButtonTextActive
                  ]}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Report Cards */}
        <Animated.View
          style={[
            styles.reportsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.reportsGrid}>
            {reportCards.map((report, index) => (
              <Animated.View
                key={report.id}
                style={[
                  styles.reportCard,
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
                <TouchableOpacity activeOpacity={0.8}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']}
                    style={styles.reportCardGradient}
                  >
                    <View style={styles.reportCardHeader}>
                      <LinearGradient
                        colors={report.color}
                        style={styles.reportIconContainer}
                      >
                        <report.icon color="white" size={20} />
                      </LinearGradient>
                      <TouchableOpacity style={styles.downloadButton}>
                        <Download color="#6B7280" size={16} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.reportData}>{report.data}</Text>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <Text style={styles.reportDescription}>{report.description}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Class Reports */}
        <Animated.View
          style={[
            styles.classReportsSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Class Performance</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Filter color="#6B7280" size={20} />
            </TouchableOpacity>
          </View>
          
          {classReports.map((classReport, index) => (
            <Animated.View
              key={classReport.className}
              style={[
                styles.classReportCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']}
                style={styles.classReportGradient}
              >
                <View style={styles.classReportHeader}>
                  <View style={styles.classReportInfo}>
                    <Text style={styles.className}>{classReport.className}</Text>
                    <Text style={styles.classStudents}>
                      {classReport.totalStudents} Students
                    </Text>
                    <Text style={styles.lastUpdated}>
                      Updated: {new Date(classReport.lastUpdated).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <FileText color="#6B7280" size={20} />
                  </TouchableOpacity>
                </View>

                <View style={styles.classMetrics}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Attendance</Text>
                    <View style={styles.metricValue}>
                      <Text style={styles.metricNumber}>{classReport.averageAttendance}%</Text>
                      <View style={styles.metricBar}>
                        <LinearGradient
                          colors={getAttendanceColor(classReport.averageAttendance)}
                          style={[
                            styles.metricBarFill,
                            { width: `${classReport.averageAttendance}%` },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Average Grade</Text>
                    <View style={styles.metricValue}>
                      <Text style={styles.metricNumber}>{classReport.averageGrade}</Text>
                      <View style={styles.metricBar}>
                        <LinearGradient
                          colors={getGradeColor(classReport.averageGrade)}
                          style={[
                            styles.metricBarFill,
                            { width: `${(classReport.averageGrade / 4) * 100}%` },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.classActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <BarChart3 color="#3B82F6" size={16} />
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Download color="#10B981" size={16} />
                    <Text style={styles.actionButtonText}>Export</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Generate Report Button */}
        <Animated.View
          style={[
            styles.generateSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity style={styles.generateButton} activeOpacity={0.8}>
            <LinearGradient
              colors={['#8B5CF6', '#7C3AED']}
              style={styles.generateButtonGradient}
            >
              <FileText color="white" size={20} />
              <Text style={styles.generateButtonText}>Generate Comprehensive Report</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  filterContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  periodButtons: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  periodButtonActive: {
    elevation: 2,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  periodButtonGradient: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  reportsSection: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  reportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reportCard: {
    width: '48%',
    marginBottom: 16,
  },
  reportCardGradient: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadButton: {
    padding: 4,
  },
  reportData: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  reportDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  classReportsSection: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
  },
  classReportCard: {
    marginBottom: 16,
  },
  classReportGradient: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  classReportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  classReportInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  classStudents: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  moreButton: {
    padding: 4,
  },
  classMetrics: {
    marginBottom: 16,
    gap: 12,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    flex: 1,
  },
  metricValue: {
    flex: 2,
    alignItems: 'flex-end',
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  metricBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  classActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  generateSection: {
    paddingHorizontal: 24,
  },
  generateButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  generateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});