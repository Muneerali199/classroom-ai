import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Shield, Users, Zap, BookOpen, Bell, TrendingUp, CheckCircle } from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from '@/contexts/AuthContext';
import {
  studentStats,
  teacherStats,
  deanStats,
  studentQuickActions,
  teacherQuickActions,
  deanQuickActions,
  recentActivities,
} from '@/constants/dashboardData';

export default function HomeScreen() {
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const floatingAnim1 = useRef(new Animated.Value(0)).current;
  const floatingAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const createFloatingAnimation = (animValue: Animated.Value) => {
      if (!animValue) return;
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -10,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 10,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
        { iterations: -1 }
      ).start();
    };

    const timeout1 = setTimeout(() => createFloatingAnimation(floatingAnim1), 0);
    const timeout2 = setTimeout(() => createFloatingAnimation(floatingAnim2), 1000);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [fadeAnim, slideAnim, floatingAnim1, floatingAnim2]);

  const getDashboardData = () => {
    if (!user) {
      return {
        stats: studentStats,
        quickActions: studentQuickActions,
        greeting: 'Welcome to EduTrack!',
        subtitle: 'Your educational management platform',
      };
    }

    switch (user.role) {
      case 'student':
        return {
          stats: studentStats,
          quickActions: studentQuickActions,
          greeting: `Welcome back, ${user.name}!`,
          subtitle: 'Ready to continue your learning journey?',
        };
      case 'teacher':
        return {
          stats: teacherStats,
          quickActions: teacherQuickActions,
          greeting: `Good day, Professor ${user.name}!`,
          subtitle: 'Manage your classes and track student progress',
        };
      case 'dean':
        return {
          stats: deanStats,
          quickActions: deanQuickActions,
          greeting: `Welcome, Dean ${user.name}!`,
          subtitle: 'Oversee institutional performance and analytics',
        };
      default:
        return {
          stats: studentStats,
          quickActions: studentQuickActions,
          greeting: 'Welcome to EduTrack!',
          subtitle: 'Your educational management platform',
        };
    }
  };

  const dashboardData = getDashboardData();

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 17) return '☀️';
    return '🌙';
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#EBF4FF", "#F3E8FF", "#FDF2F8"]}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Floating Elements */}
      <Animated.View
        style={[
          styles.floatingElement1,
          { transform: [{ translateY: floatingAnim1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingElement2,
          { transform: [{ translateY: floatingAnim2 }] },
        ]}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingIcon}>{getGreetingIcon()}</Text>
            <View style={styles.greetingText}>
              <Text style={styles.greeting}>{dashboardData.greeting}</Text>
              <Text style={styles.subtitle}>{dashboardData.subtitle}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell color="#8B5CF6" size={24} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.statsGrid}>
            {dashboardData.stats.map((stat, index) => (
              <Animated.View
                key={stat.label}
                style={[
                  styles.statCard,
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
                  colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.6)"]}
                  style={styles.statGradient}
                >
                  <View style={styles.statHeader}>
                    <Text style={styles.statIcon}>{stat.icon}</Text>
                    <View style={styles.statTrend}>
                      <TrendingUp color="#10B981" size={12} />
                    </View>
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </LinearGradient>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.actionsContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {dashboardData.quickActions.map((action) => (
              <Animated.View
                key={action.id}
                style={[
                  styles.actionCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideAnim,
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={action.color}
                    style={styles.actionGradient}
                  >
                    <Text style={styles.actionIcon}>{action.icon}</Text>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionDescription}>
                      {action.description}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View
          style={[
            styles.recentActivitySection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivities.map((activity, index) => (
              <Animated.View
                key={activity.id}
                style={[
                  styles.activityItem,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                  },
                ]}
              >
                <LinearGradient
                  colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.6)"]}
                  style={styles.activityCard}
                >
                  <View style={styles.activityIcon}>
                    <CheckCircle color="#10B981" size={20} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDescription}>
                      {activity.description}
                    </Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
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
  floatingElement1: {
    position: "absolute",
    top: 100,
    left: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    zIndex: 0,
  },
  floatingElement2: {
    position: "absolute",
    top: 200,
    right: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(236, 72, 153, 0.1)",
    zIndex: 0,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  greetingText: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    marginBottom: 16,
  },
  statGradient: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    fontSize: 24,
  },
  statTrend: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  actionsContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
    textAlign: "center",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    marginBottom: 16,
  },
  actionButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  actionGradient: {
    padding: 20,
    alignItems: "center",
    minHeight: 140,
    justifyContent: "center",
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    textAlign: "center",
  },
  actionDescription: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 14,
    flex: 1,
  },
  recentActivitySection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    marginBottom: 12,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});