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
import { Bell, TrendingUp, CheckCircle } from "lucide-react-native";
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

  // Responsive helpers
  const isSmallScreen = width < 400;
  const isTablet = width > 600;
  const scaleFont = (size: number) => Math.round(size * (width / 375));
  const scaleSize = (size: number) => Math.round(size * (width / 375));
  const responsivePadding = isSmallScreen ? 12 : isTablet ? 32 : 24;
  const responsiveMargin = isSmallScreen ? 12 : isTablet ? 24 : 16;

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
      case 'admin':
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
          { transform: [{ translateY: floatingAnim1 }], width: scaleSize(80), height: scaleSize(80), borderRadius: scaleSize(40), top: scaleSize(100), left: scaleSize(30) },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingElement2,
          { transform: [{ translateY: floatingAnim2 }], width: scaleSize(60), height: scaleSize(60), borderRadius: scaleSize(30), top: scaleSize(200), right: scaleSize(40) },
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
              paddingHorizontal: responsivePadding,
              paddingTop: isSmallScreen ? 20 : 40,
              paddingBottom: isSmallScreen ? 20 : 30,
            },
          ]}
        >
          <View style={styles.greetingContainer}>
            <Text style={[styles.greetingIcon, { fontSize: scaleFont(32), marginRight: responsiveMargin }]}>{getGreetingIcon()}</Text>
            <View style={styles.greetingText}>
              <Text style={[styles.greeting, { fontSize: scaleFont(24) }]}>{dashboardData.greeting}</Text>
              <Text style={[styles.subtitle, { fontSize: scaleFont(14), lineHeight: scaleFont(20) }]}>{dashboardData.subtitle}</Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => router.push('/notifications')}
            >
              <Bell color="#8B5CF6" size={scaleSize(24)} />
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
              paddingHorizontal: responsivePadding,
              marginBottom: responsiveMargin * 2,
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
                    width: isTablet ? "48%" : "100%",
                    marginBottom: responsiveMargin,
                  },
                ]}
              >
                <LinearGradient
                  colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.6)"]}
                  style={styles.statGradient}
                >
                  <View style={styles.statHeader}>
                    <Text style={[styles.statIcon, { fontSize: scaleFont(24) }]}>{stat.icon}</Text>
                    <View style={styles.statTrend}>
                      <TrendingUp color="#10B981" size={scaleSize(12)} />
                    </View>
                  </View>
                  <Text style={[styles.statValue, { fontSize: scaleFont(24) }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { fontSize: scaleFont(12) }]}>{stat.label}</Text>
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
              paddingHorizontal: responsivePadding,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { fontSize: scaleFont(24), marginBottom: responsiveMargin }]}>Quick Actions</Text>
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
                    width: isTablet ? "48%" : "100%",
                    marginBottom: responsiveMargin,
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
                    <Text style={[styles.actionIcon, { fontSize: scaleFont(28) }]}>{action.icon}</Text>
                    <Text style={[styles.actionTitle, { fontSize: scaleFont(16) }]}>{action.title}</Text>
                    <Text style={[styles.actionDescription, { fontSize: scaleFont(11), lineHeight: scaleFont(14) }]}>
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
              paddingHorizontal: responsivePadding,
              marginTop: responsiveMargin,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { fontSize: scaleFont(24), marginBottom: responsiveMargin }]}>Recent Activity</Text>
          <View style={styles.activityList}>
            {recentActivities.map((activity, index) => (
              <Animated.View
                key={activity.id}
                style={[
                  styles.activityItem,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                    marginBottom: responsiveMargin,
                  },
                ]}
              >
                <LinearGradient
                  colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.6)"]}
                  style={styles.activityCard}
                >
                  <View style={[styles.activityIcon, { width: scaleSize(40), height: scaleSize(40), borderRadius: scaleSize(20), marginRight: responsiveMargin }]}>
                    <CheckCircle color="#10B981" size={scaleSize(20)} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={[styles.activityTitle, { fontSize: scaleFont(14) }]}>{activity.title}</Text>
                    <Text style={[styles.activityDescription, { fontSize: scaleFont(12) }]}>
                      {activity.description}
                    </Text>
                    <Text style={[styles.activityTime, { fontSize: scaleFont(11) }]}>{activity.time}</Text>
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
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    zIndex: 0,
  },
  floatingElement2: {
    position: "absolute",
    backgroundColor: "rgba(236, 72, 153, 0.1)",
    zIndex: 0,
  },
  heroSection: {
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingIcon: {
  },
  greetingText: {
    flex: 1,
  },
  greeting: {
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  subtitle: {
    color: "#6B7280",
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
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
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
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statLabel: {
    color: "#6B7280",
    fontWeight: "600",
  },
  actionsContainer: {
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
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
    marginBottom: 8,
  },
  actionTitle: {
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
    textAlign: "center",
  },
  actionDescription: {
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    flex: 1,
  },
  recentActivitySection: {
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
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
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityDescription: {
    color: '#6B7280',
    marginBottom: 4,
  },
  activityTime: {
    color: '#9CA3AF',
  },
});
