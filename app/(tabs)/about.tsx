import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Users, Zap, Shield, Target, LogOut, Code, Smartphone, Database, Cloud, Clock, BarChart3, Lock, CheckCircle, Github, Linkedin, Mail } from "lucide-react-native";
import { useAuth } from '@/contexts/AuthContext';
import { categories, getStackByCategory } from '../../constants/techStack';

export default function AboutScreen() {
  const { logout, user } = useAuth();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [selectedCategory, setSelectedCategory] = useState<string>('Mobile');
  const [techFadeAnim] = useState(new Animated.Value(1));
  const [activeTab, setActiveTab] = useState<'about' | 'features' | 'team'>('about');

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

  const benefits = [
    {
      id: "for-everyone",
      icon: Users,
      title: "For Everyone",
      description: "Students, teachers, and deans all benefit from our intuitive platform.",
      colors: ["#3B82F6", "#8B5CF6"] as const,
    },
    {
      id: "lightning-fast",
      icon: Zap,
      title: "Lightning Fast",
      description: "Attendance marked in seconds with real-time synchronization.",
      colors: ["#10B981", "#059669"] as const,
    },
    {
      id: "secure-access",
      icon: Shield,
      title: "Secure Access",
      description: "Institution-controlled with dean-supervised user creation.",
      colors: ["#EF4444", "#DC2626"] as const,
    },
    {
      id: "role-based",
      icon: Target,
      title: "Role-Based",
      description: "Complete data privacy with role-based permissions.",
      colors: ["#F59E0B", "#D97706"] as const,
    },
  ];

  const stats = [
    { id: "active-users", label: "Active Users", value: "50K+" },
    { id: "institutions", label: "Institutions", value: "500+" },
    { id: "uptime", label: "Uptime", value: "99.9%" },
    { id: "countries", label: "Countries", value: "25+" },
  ];

  const handleCategoryChange = (category: string) => {
    Animated.sequence([
      Animated.timing(techFadeAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(techFadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setSelectedCategory(category);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Mobile': return Smartphone;
      case 'Frontend': return Code;
      case 'Backend': return Database;
      case 'Database': return Database;
      case 'Cloud': return Cloud;
      case 'DevOps': return Code;
      default: return Code;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#F8FAFC", "#F1F5F9", "#E2E8F0"]}
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
          <View style={styles.headerContent}>
            <View style={styles.headerText}>
              <Text style={styles.title}>About Our Platform</Text>
              <Text style={styles.subtitle}>
                Secure, institution-controlled educational management with
                dean-supervised access, ensuring data privacy and role-based
                permissions.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={logout}
              activeOpacity={0.7}
            >
              <LogOut color="#8B5CF6" size={24} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* User Info */}
        {user && (
          <Animated.View
            style={[
              styles.userSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(139, 92, 246, 0.1)", "rgba(139, 92, 246, 0.05)"]}
              style={styles.userCard}
            >
              <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
              <Text style={styles.userRole}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
              <Text style={styles.userInstitution}>{user.institution}</Text>
            </LinearGradient>
          </Animated.View>
        )}

        <Animated.View
          style={[
            styles.missionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.6)"]}
            style={styles.missionCard}
          >
            <Text style={styles.missionTitle}>Our Mission</Text>
            <Text style={styles.missionText}>
              We&apos;re building secure educational technology by providing
              institutions with controlled access management, dean-supervised
              user creation, and role-based permissions ensuring complete data
              privacy and institutional oversight of attendance and student
              management systems.
            </Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={[
            styles.benefitsSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Key Benefits</Text>
          <View style={styles.benefitsGrid}>
            {benefits.map((benefit) => (
              <Animated.View
                key={benefit.id}
                style={[
                  styles.benefitCard,
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
                <LinearGradient
                  colors={[benefit.colors[0], benefit.colors[1], benefit.colors[1] + "20"]}
                  style={styles.benefitGradient}
                >
                  <View style={styles.benefitIconContainer}>
                    <benefit.icon color="white" size={24} />
                  </View>
                  <Text style={styles.benefitTitle}>{benefit.title}</Text>
                  <Text style={styles.benefitDescription}>
                    {benefit.description}
                  </Text>
                </LinearGradient>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Tech Stack Section */}
        <Animated.View
          style={[
            styles.techStackSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Tech Stack</Text>
          <Text style={styles.sectionSubtitle}>
            Built with modern, reliable technologies for optimal performance
          </Text>
          
          {/* Category Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoryTabs}
            contentContainerStyle={styles.categoryTabsContent}
          >
            {categories.map((category) => {
              const IconComponent = getCategoryIcon(category);
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryTab,
                    isSelected && styles.categoryTabActive
                  ]}
                  onPress={() => handleCategoryChange(category)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={isSelected ? ['#8B5CF6', '#7C3AED'] : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']}
                    style={styles.categoryTabGradient}
                  >
                    <IconComponent 
                      size={16} 
                      color={isSelected ? 'white' : '#6B7280'} 
                    />
                    <Text style={[
                      styles.categoryTabText,
                      isSelected && styles.categoryTabTextActive
                    ]}>
                      {category}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Tech Stack Items */}
          <Animated.View style={[styles.techStackGrid, { opacity: techFadeAnim }]}>
            {getStackByCategory(selectedCategory as any).map((tech, index) => (
              <View key={tech.name} style={styles.techStackItem}>
                <LinearGradient
                  colors={[`${tech.color[0]}20`, `${tech.color[1]}20`]}
                  style={styles.techStackItemGradient}
                >
                  <Text style={styles.techStackIcon}>{tech.icon}</Text>
                  <Text style={styles.techStackName}>{tech.name}</Text>
                  <Text style={styles.techStackDescription}>{tech.description}</Text>
                </LinearGradient>
              </View>
            ))}
          </Animated.View>
        </Animated.View>

        {/* Tab Navigation */}
        <Animated.View
          style={[
            styles.tabNavigation,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.tabContainer}>
            {[{key: 'about', label: 'About'}, {key: 'features', label: 'Features'}, {key: 'team', label: 'Team'}].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tabButton,
                  activeTab === tab.key && styles.tabButtonActive
                ]}
                onPress={() => setActiveTab(tab.key as any)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={activeTab === tab.key ? ['#8B5CF6', '#7C3AED'] : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']}
                  style={styles.tabButtonGradient}
                >
                  <Text style={[
                    styles.tabButtonText,
                    activeTab === tab.key && styles.tabButtonTextActive
                  ]}>
                    {tab.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Tab Content */}
        {activeTab === 'about' && (
          <Animated.View
            style={[
              styles.statsSection,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Platform Statistics</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat) => (
                <Animated.View
                  key={stat.id}
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
                    <Text style={[styles.statValue, { color: "#8B5CF6" }]}>
                      {stat.value}
                    </Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </LinearGradient>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Features Tab Content */}
        {activeTab === 'features' && (
          <FeaturesContent fadeAnim={fadeAnim} slideAnim={slideAnim} />
        )}

        {/* Team Tab Content */}
        {activeTab === 'team' && (
          <TeamContent fadeAnim={fadeAnim} slideAnim={slideAnim} />
        )}
      </ScrollView>
    </View>
  );
}

// Features Component
function FeaturesContent({ fadeAnim, slideAnim }: { fadeAnim: Animated.Value; slideAnim: Animated.Value }) {
  const features = [
    {
      id: "secure-access",
      icon: Shield,
      title: "Secure Access Control",
      description: "Dean-supervised user creation with institutional oversight and role-based permissions.",
      colors: ["#3B82F6", "#1D4ED8"] as const,
    },
    {
      id: "real-time",
      icon: Clock,
      title: "Real-time Attendance",
      description: "Lightning-fast attendance marking with instant synchronization across all devices.",
      colors: ["#10B981", "#047857"] as const,
    },
    {
      id: "multi-role",
      icon: Users,
      title: "Multi-role Support",
      description: "Seamless experience for students, teachers, and administrators with tailored interfaces.",
      colors: ["#8B5CF6", "#7C3AED"] as const,
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive reporting and analytics for attendance patterns and insights.",
      colors: ["#F59E0B", "#D97706"] as const,
    },
    {
      id: "data-privacy",
      icon: Lock,
      title: "Data Privacy",
      description: "Complete institutional control over data with advanced encryption and security measures.",
      colors: ["#EF4444", "#DC2626"] as const,
    },
    {
      id: "mobile-first",
      icon: Smartphone,
      title: "Mobile First",
      description: "Optimized mobile experience with offline capabilities and cross-platform support.",
      colors: ["#EC4899", "#DB2777"] as const,
    },
  ];

  const highlights = [
    { id: "institution", text: "Institution-controlled platform" },
    { id: "dean-supervised", text: "Dean-supervised access" },
    { id: "role-based", text: "Role-based permissions" },
    { id: "real-time", text: "Real-time synchronization" },
    { id: "security", text: "Advanced security" },
    { id: "mobile", text: "Mobile-optimized" },
  ];

  return (
    <>
      <Animated.View
        style={[
          styles.highlightsSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.6)"]}
          style={styles.highlightsCard}
        >
          <Text style={styles.highlightsTitle}>Key Highlights</Text>
          <View style={styles.highlightsList}>
            {highlights.map((highlight) => (
              <Animated.View
                key={highlight.id}
                style={[
                  styles.highlightItem,
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
                <CheckCircle color="#10B981" size={16} />
                <Text style={styles.highlightText}>{highlight.text}</Text>
              </Animated.View>
            ))}
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        style={[
          styles.featuresSection,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Core Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <Animated.View
              key={feature.id}
              style={[
                styles.featureCard,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideAnim,
                    },
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={[feature.colors[0], feature.colors[1], feature.colors[1] + "20"]}
                style={styles.featureGradient}
              >
                <View style={styles.featureIconContainer}>
                  <feature.icon color="white" size={24} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </>
  );
}

// Team Component
function TeamContent({ fadeAnim, slideAnim }: { fadeAnim: Animated.Value; slideAnim: Animated.Value }) {
  const team = [
    {
      id: "alex-johnson",
      name: "Alex Johnson",
      role: "Lead Developer",
      bio: "Full-stack developer with 8+ years of experience in educational technology and secure platform development.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "alex@example.com",
      },
    },
    {
      id: "sarah-chen",
      name: "Sarah Chen",
      role: "UI/UX Designer",
      bio: "Creative designer focused on intuitive user experiences and accessibility in educational platforms.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "sarah@example.com",
      },
    },
    {
      id: "michael-rodriguez",
      name: "Michael Rodriguez",
      role: "Backend Engineer",
      bio: "Security-focused backend developer specializing in scalable architecture and data protection.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "michael@example.com",
      },
    },
    {
      id: "emily-davis",
      name: "Emily Davis",
      role: "Product Manager",
      bio: "Strategic product leader with deep understanding of educational institution needs and compliance.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "emily@example.com",
      },
    },
  ];

  return (
    <Animated.View
      style={[
        styles.teamSection,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <Text style={styles.sectionTitle}>Meet Our Team</Text>
      <Text style={styles.sectionSubtitle}>
        A passionate team of developers and designers dedicated to transforming educational technology.
      </Text>
      <View style={styles.teamGrid}>
        {team.map((member) => (
          <Animated.View
            key={member.id}
            style={[
              styles.memberCard,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim,
                  },
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.6)"]}
              style={styles.memberGradient}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: member.image }} style={styles.memberImage} />
                <LinearGradient
                  colors={["rgba(139, 92, 246, 0.1)", "rgba(236, 72, 153, 0.1)"]}
                  style={styles.imageOverlay}
                />
              </View>

              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
              <Text style={styles.memberBio}>{member.bio}</Text>

              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Github color="#6B7280" size={18} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Linkedin color="#6B7280" size={18} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Mail color="#6B7280" size={18} />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
    paddingRight: 16,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  userSection: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  userCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 2,
  },
  userInstitution: {
    fontSize: 12,
    color: '#6B7280',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  missionSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  missionCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  missionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  missionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  benefitsSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
    textAlign: "center",
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  benefitCard: {
    width: "48%",
    marginBottom: 16,
  },
  benefitGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    minHeight: 160,
    justifyContent: "center",
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
    textAlign: "center",
  },
  benefitDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 16,
  },
  statsSection: {
    paddingHorizontal: 24,
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
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  techStackSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  categoryTabs: {
    marginVertical: 20,
  },
  categoryTabsContent: {
    paddingHorizontal: 4,
  },
  categoryTab: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryTabActive: {
    elevation: 4,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  categoryTabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.2)',
  },
  categoryTabText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryTabTextActive: {
    color: 'white',
  },
  techStackGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  techStackItem: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  techStackItemGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  techStackIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  techStackName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  techStackDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Tab Navigation Styles
  tabNavigation: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 25,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tabButtonActive: {
    elevation: 4,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tabButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 20,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabButtonTextActive: {
    color: 'white',
  },
  // Features Styles
  highlightsSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  highlightsCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  highlightsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  highlightsList: {
    gap: 12,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  highlightText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  featuresSection: {
    paddingHorizontal: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    marginBottom: 16,
  },
  featureGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 16,
  },
  // Team Styles
  teamSection: {
    paddingHorizontal: 24,
  },
  teamGrid: {
    gap: 20,
  },
  memberCard: {
    marginBottom: 20,
  },
  memberGradient: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  memberImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  imageOverlay: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 44,
    zIndex: -1,
  },
  memberName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  memberRole: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  memberBio: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});