import { Tabs } from "expo-router";
import { Home, Info, MessageCircle, Calendar, Award, Users, BarChart3, Activity, Settings, User } from "lucide-react-native";
import React from "react";
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

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
      {
        name: "about",
        title: "About",
        icon: Info,
      },
    ];

    switch (user?.role) {
      case 'student':
        return [
          ...commonTabs.slice(0, 1), // Dashboard
          {
            name: "schedule",
            title: "Schedule",
            icon: Calendar,
          },
          {
            name: "grades",
            title: "Grades",
            icon: Award,
          },
          ...commonTabs.slice(1), // AI Assistant, Profile, and About
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
            icon: BarChart3,
          },
          ...commonTabs.slice(1), // AI Assistant, Profile, and About
        ];
      case 'dean':
        return [
          ...commonTabs.slice(0, 1), // Dashboard
          {
            name: "analytics",
            title: "Analytics",
            icon: BarChart3,
          },
          {
            name: "management",
            title: "Management",
            icon: Settings,
          },
          ...commonTabs.slice(1), // AI Assistant, Profile, and About
        ];
      default:
        return commonTabs;
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
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => <tab.icon color={color} size={size} />,
          }}
        />
      ))}
    </Tabs>
  );
}