import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Bell, BellOff, Mail, Calendar, MessageSquare, Shield } from 'lucide-react-native';
import { router } from 'expo-router';

interface NotificationItem {
  id: string;
  type: 'system' | 'academic' | 'social' | 'security';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'academic',
      title: 'New Grade Posted',
      message: 'Your grade for Software Engineering has been updated to A-',
      time: '2 minutes ago',
      read: false,
      icon: <Bell color="#8B5CF6" size={20} />,
    },
    {
      id: '2',
      type: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance this Saturday from 2-4 AM',
      time: '1 hour ago',
      read: true,
      icon: <Shield color="#3B82F6" size={20} />,
    },
    {
      id: '3',
      type: 'social',
      title: 'New Message',
      message: 'You have a new message from Professor Johnson',
      time: '3 hours ago',
      read: true,
      icon: <MessageSquare color="#10B981" size={20} />,
    },
    {
      id: '4',
      type: 'academic',
      title: 'Assignment Due',
      message: 'Reminder: Database Systems assignment due tomorrow',
      time: '5 hours ago',
      read: true,
      icon: <Calendar color="#F59E0B" size={20} />,
    },
    {
      id: '5',
      type: 'security',
      title: 'Security Alert',
      message: 'New login detected from a new device',
      time: '12 hours ago',
      read: true,
      icon: <Shield color="#EF4444" size={20} />,
    },
    {
      id: '6',
      type: 'system',
      title: 'New Feature Available',
      message: 'Check out the new grade tracking feature in your dashboard',
      time: '1 day ago',
      read: true,
      icon: <Bell color="#8B5CF6" size={20} />,
    },
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
    academicAlerts: true,
    systemUpdates: true,
    socialNotifications: false,
    securityAlerts: true,
  });

  const toggleNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: !notification.read }
          : notification
      )
    );
  };

  const toggleSetting = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'academic':
        return '#8B5CF6';
      case 'system':
        return '#3B82F6';
      case 'social':
        return '#10B981';
      case 'security':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#EBF4FF", "#F3E8FF", "#FDF2F8"]}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.actionText}>Mark All Read</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.clearButton]}
            onPress={clearAllNotifications}
          >
            <Text style={[styles.actionText, styles.clearText]}>Clear All</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <View style={styles.notificationsSection}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <BellOff color="#9CA3AF" size={48} />
              <Text style={styles.emptyText}>No notifications</Text>
              <Text style={styles.emptySubtext}>
                You're all caught up! New notifications will appear here.
              </Text>
            </View>
          ) : (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.unreadNotification,
                ]}
                onPress={() => toggleNotificationRead(notification.id)}
              >
                <View
                  style={[
                    styles.notificationIcon,
                    { backgroundColor: `${getNotificationColor(notification.type)}20` },
                  ]}
                >
                  {notification.icon}
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {notification.time}
                  </Text>
                </View>
                {!notification.read && (
                  <View
                    style={[
                      styles.unreadDot,
                      { backgroundColor: getNotificationColor(notification.type) },
                    ]}
                  />
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Notification Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <View style={styles.settingsCard}>
            {Object.entries(notificationSettings).map(([key, value]) => (
              <View key={key} style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())
                      .replace('Sms', 'SMS')}
                  </Text>
                  <Text style={styles.settingDescription}>
                    {getSettingDescription(key)}
                  </Text>
                </View>
                <Switch
                  value={value}
                  onValueChange={() => toggleSetting(key as keyof typeof notificationSettings)}
                  thumbColor={value ? getSettingColor(key) : '#f4f3f4'}
                  trackColor={{ false: '#767577', true: `${getSettingColor(key)}40` }}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getSettingDescription = (key: string): string => {
  switch (key) {
    case 'pushNotifications':
      return 'Receive push notifications on your device';
    case 'emailNotifications':
      return 'Get notifications via email';
    case 'smsNotifications':
      return 'Receive text message alerts';
    case 'academicAlerts':
      return 'Grades, assignments, and course updates';
    case 'systemUpdates':
      return 'Platform maintenance and new features';
    case 'socialNotifications':
      return 'Messages and social interactions';
    case 'securityAlerts':
      return 'Important security and login alerts';
    default:
      return '';
  }
};

const getSettingColor = (key: string): string => {
  switch (key) {
    case 'securityAlerts':
      return '#EF4444';
    case 'academicAlerts':
      return '#8B5CF6';
    case 'systemUpdates':
      return '#3B82F6';
    case 'socialNotifications':
      return '#10B981';
    default:
      return '#8B5CF6';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 0,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
  },
  clearButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  clearText: {
    color: '#6B7280',
  },
  notificationsSection: {
    padding: 20,
  },
  settingsSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unreadNotification: {
    backgroundColor: '#F9FAFB',
    borderColor: '#8B5CF6',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});