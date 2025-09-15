import { Tabs } from "expo-router";
import { Home, Info, BookOpen, BarChart3, Settings } from "lucide-react-native";
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
        name: "about",
        title: "About",
        icon: Info,
      },
    ];

    switch (user?.role) {
      case 'student':
        return [
          ...commonTabs,
          {
            name: "schedule",
            title: "Schedule",
            icon: BookOpen,
          },
          {
            name: "grades",
            title: "Grades",
            icon: BarChart3,
          },
        ];
      case 'teacher':
        return [
          ...commonTabs,
          {
            name: "classes",
            title: "Classes",
            icon: BookOpen,
          },
          {
            name: "reports",
            title: "Reports",
            icon: BarChart3,
          },
        ];
      case 'dean':
        return [
          ...commonTabs,
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