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
} from "lucide-react-native";
import React from "react";
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getTabsForRole = () => {
    const commonTabs = [
      {
        name: "index",
        title: "Dashboard",
        icon: Home,
      },
      {
        name: "chatbot",
        title: "AI Assistant",
        icon: MessageCircle,
      },
      {
        name: "profile",
        title: "Profile",
        icon: User,
      },
    ];

    switch (user?.role) {
      case 'student':
        return [
          ...commonTabs.slice(0, 1), // Dashboard
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
            name: "courses",
            title: "Courses",
            icon: BookOpen,
          },
          {
            name: "schedule",
            title: "Schedule",
            icon: Calendar,
          },
          ...commonTabs.slice(1), // AI Assistant and Profile
        ];
      case 'teacher':
        return [
          ...commonTabs.slice(0, 1), // Dashboard
          {
            name: "classes",
            title: "Classes",
            icon: Users,
          },
          {
            name: "reports",
            title: "Reports",
            icon: ClipboardList,
          },
          {
            name: "attendance",
            title: "Attendance",
            icon: Calendar,
          },
          ...commonTabs.slice(1), // AI Assistant and Profile
        ];
      case 'admin':
        return [
          ...commonTabs.slice(0, 1), // Dashboard
          {
            name: "analytics",
            title: "Analytics",
            icon: PieChart,
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
          ...commonTabs.slice(1), // AI Assistant and Profile
        ];
      default:
        return [
          ...commonTabs,
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
            name: "reports",
            title: "Reports",
            icon: ClipboardList,
          },
          {
            name: "analytics",
            title: "Analytics",
            icon: PieChart,
          },
          {
            name: "management",
            title: "Management",
            icon: Settings,
          },
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