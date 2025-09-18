import { Tabs } from "expo-router";
import {
  Home,
  MessageCircle,
  Calendar,
  Award,
  Users,
  BarChart3,
  Settings,
  User,
  BookOpen,
  ClipboardList,
  PieChart,
  Zap,
} from "lucide-react-native";
import React from "react";
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getTabsForRole = () => {
    // AI Assistant available for all roles
    const aiAssistantTab = {
      name: "chatbot",
      title: "AI Assistant",
      icon: MessageCircle,
    };

    const profileTab = {
      name: "profile",
      title: "Profile",
      icon: User,
    };

    switch (user?.role) {
      case 'student':
        return [
          {
            name: "index",
            title: "Dashboard",
            icon: Home,
          },
          {
            name: "courses",
            title: "My Courses",
            icon: BookOpen,
          },
          {
            name: "grades",
            title: "Grades",
            icon: Award,
          },
          {
            name: "attendance",
            title: "Attendance",
            icon: Calendar,
          },
          {
            name: "schedule",
            title: "Schedule",
            icon: Calendar,
          },
          aiAssistantTab,
          profileTab,
        ];
      case 'teacher':
        return [
          {
            name: "index",
            title: "Dashboard",
            icon: Home,
          },
          {
            name: "classes",
            title: "My Classes",
            icon: Users,
          },
          {
            name: "attendance",
            title: "Attendance",
            icon: Calendar,
          },
          {
            name: "reports",
            title: "Reports",
            icon: ClipboardList,
          },
          aiAssistantTab,
          profileTab,
        ];
      case 'admin':
        return [
          {
            name: "index",
            title: "Dashboard",
            icon: Home,
          },
          {
            name: "analytics",
            title: "Analytics",
            icon: PieChart,
          },
          {
            name: "timetable-generator",
            title: "Timetable AI",
            icon: Zap,
          },
          {
            name: "management",
            title: "Management",
            icon: Settings,
          },
          {
            name: "reports",
            title: "Reports",
            icon: BarChart3,
          },
          aiAssistantTab,
          profileTab,
        ];
      default:
        // Fallback for users without specific roles or during development
        return [
          {
            name: "index",
            title: "Dashboard",
            icon: Home,
          },
          {
            name: "courses",
            title: "Courses",
            icon: BookOpen,
          },
          {
            name: "classes",
            title: "Classes",
            icon: Users,
          },
          {
            name: "grades",
            title: "Grades",
            icon: Award,
          },
          {
            name: "attendance",
            title: "Attendance",
            icon: Calendar,
          },
          {
            name: "analytics",
            title: "Analytics",
            icon: PieChart,
          },
          {
            name: "reports",
            title: "Reports",
            icon: ClipboardList,
          },
          {
            name: "management",
            title: "Management",
            icon: Settings,
          },
          aiAssistantTab,
          profileTab,
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8B5CF6",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 10,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <tab.icon color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
