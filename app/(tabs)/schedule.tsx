import React, { useState, useEffect, useRef } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react-native';

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  endTime: string;
  location: string;
  type: 'lecture' | 'lab' | 'tutorial' | 'exam';
  instructor?: string;
  color: [string, string];
}

interface DaySchedule {
  date: string;
  day: string;
  items: ScheduleItem[];
}

const mockSchedule: DaySchedule[] = [
  {
    date: '2024-01-15',
    day: 'Monday',
    items: [
      {
        id: '1',
        title: 'Advanced Mathematics',
        time: '09:00',
        endTime: '10:30',
        location: 'Room 101',
        type: 'lecture',
        instructor: 'Dr. Smith',
        color: ['#3B82F6', '#1D4ED8'],
      },
      {
        id: '2',
        title: 'Data Structures Lab',
        time: '11:00',
        endTime: '12:30',
        location: 'Lab 205',
        type: 'lab',
        instructor: 'Prof. Johnson',
        color: ['#10B981', '#059669'],
      },
      {
        id: '3',
        title: 'Physics Tutorial',
        time: '14:00',
        endTime: '15:00',
        location: 'Room 301',
        type: 'tutorial',
        instructor: 'Dr. Brown',
        color: ['#8B5CF6', '#7C3AED'],
      },
    ],
  },
  {
    date: '2024-01-16',
    day: 'Tuesday',
    items: [
      {
        id: '4',
        title: 'Calculus II',
        time: '10:00',
        endTime: '11:30',
        location: 'Room 102',
        type: 'lecture',
        instructor: 'Dr. Wilson',
        color: ['#F59E0B', '#D97706'],
      },
      {
        id: '5',
        title: 'Programming Lab',
        time: '13:00',
        endTime: '15:00',
        location: 'Lab 301',
        type: 'lab',
        instructor: 'Prof. Davis',
        color: ['#EF4444', '#DC2626'],
      },
    ],
  },
  {
    date: '2024-01-17',
    day: 'Wednesday',
    items: [
      {
        id: '6',
        title: 'Statistics',
        time: '09:00',
        endTime: '10:30',
        location: 'Room 201',
        type: 'lecture',
        instructor: 'Dr. Taylor',
        color: ['#06B6D4', '#0891B2'],
      },
      {
        id: '7',
        title: 'Midterm Exam',
        time: '14:00',
        endTime: '16:00',
        location: 'Hall A',
        type: 'exam',
        color: ['#EC4899', '#DB2777'],
      },
    ],
  },
];

export default function ScheduleScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [selectedWeek, setSelectedWeek] = useState(0);

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture':
        return BookOpen;
      case 'lab':
        return Users;
      case 'tutorial':
        return Clock;
      case 'exam':
        return Calendar;
      default:
        return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture':
        return '#3B82F6';
      case 'lab':
        return '#10B981';
      case 'tutorial':
        return '#8B5CF6';
      case 'exam':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const isCurrentTime = (startTime: string, endTime: string) => {
    const current = getCurrentTime();
    return current >= startTime && current <= endTime;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Schedule</Text>
          <Text style={styles.headerSubtitle}>
            {user?.role === 'student' ? 'Class Schedule' : 'Teaching Schedule'}
          </Text>
        </View>
        
        <View style={styles.weekNavigation}>
          <TouchableOpacity
            style={styles.weekButton}
            onPress={() => setSelectedWeek(selectedWeek - 1)}
          >
            <ChevronLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.weekText}>This Week</Text>
          <TouchableOpacity
            style={styles.weekButton}
            onPress={() => setSelectedWeek(selectedWeek + 1)}
          >
            <ChevronRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mockSchedule.map((daySchedule, dayIndex) => (
          <Animated.View
            key={daySchedule.date}
            style={[
              styles.dayContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.dayHeader}>
              <View style={styles.dayInfo}>
                <Text style={styles.dayName}>{daySchedule.day}</Text>
                <Text style={styles.dayDate}>
                  {new Date(daySchedule.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              <View style={styles.dayStats}>
                <Text style={styles.dayStatsText}>
                  {daySchedule.items.length} classes
                </Text>
              </View>
            </View>

            {daySchedule.items.length > 0 ? (
              daySchedule.items.map((item, itemIndex) => {
                const TypeIcon = getTypeIcon(item.type);
                const isCurrent = isCurrentTime(item.time, item.endTime);
                
                return (
                  <Animated.View
                    key={item.id}
                    style={[
                      styles.scheduleItem,
                      isCurrent && styles.currentScheduleItem,
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
                    <LinearGradient
                      colors={isCurrent ? ['#10B981', '#059669'] : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                      style={styles.scheduleItemGradient}
                    >
                      <View style={styles.timeContainer}>
                        <Text style={[
                          styles.timeText,
                          isCurrent && styles.currentTimeText,
                        ]}>
                          {item.time}
                        </Text>
                        <Text style={[
                          styles.endTimeText,
                          isCurrent && styles.currentEndTimeText,
                        ]}>
                          {item.endTime}
                        </Text>
                        {isCurrent && (
                          <View style={styles.currentIndicator}>
                            <Text style={styles.currentIndicatorText}>Now</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.itemContent}>
                        <View style={styles.itemHeader}>
                          <LinearGradient
                            colors={item.color}
                            style={styles.itemIcon}
                          >
                            <TypeIcon size={16} color="#FFFFFF" />
                          </LinearGradient>
                          <View style={styles.itemInfo}>
                            <Text style={[
                              styles.itemTitle,
                              isCurrent && styles.currentItemTitle,
                            ]}>
                              {item.title}
                            </Text>
                            <View style={styles.itemDetails}>
                              <View style={styles.itemDetail}>
                                <MapPin size={12} color={isCurrent ? '#FFFFFF' : '#6B7280'} />
                                <Text style={[
                                  styles.itemDetailText,
                                  isCurrent && styles.currentItemDetailText,
                                ]}>
                                  {item.location}
                                </Text>
                              </View>
                              {item.instructor && (
                                <View style={styles.itemDetail}>
                                  <Users size={12} color={isCurrent ? '#FFFFFF' : '#6B7280'} />
                                  <Text style={[
                                    styles.itemDetailText,
                                    isCurrent && styles.currentItemDetailText,
                                  ]}>
                                    {item.instructor}
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>

                        <View style={[
                          styles.typebadge,
                          { backgroundColor: getTypeColor(item.type) + '20' },
                        ]}>
                          <Text style={[
                            styles.typeBadgeText,
                            { color: getTypeColor(item.type) },
                          ]}>
                            {item.type.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </Animated.View>
                );
              })
            ) : (
              <View style={styles.emptyDay}>
                <Calendar size={32} color="#9CA3AF" />
                <Text style={styles.emptyDayText}>No classes scheduled</Text>
              </View>
            )}
          </Animated.View>
        ))}

        {/* Add Event Button for Teachers */}
        {user?.role === 'teacher' && (
          <Animated.View
            style={[
              styles.addEventContainer,
              { opacity: fadeAnim },
            ]}
          >
            <TouchableOpacity style={styles.addEventButton}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.addEventGradient}
              >
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.addEventText}>Add Class</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 8,
  },
  weekButton: {
    padding: 8,
  },
  weekText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  dayContainer: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dayDate: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  dayStats: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dayStatsText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  scheduleItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  currentScheduleItem: {
    elevation: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scheduleItemGradient: {
    flexDirection: 'row',
    padding: 16,
  },
  timeContainer: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  currentTimeText: {
    color: '#FFFFFF',
  },
  endTimeText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  currentEndTimeText: {
    color: 'rgba(255,255,255,0.8)',
  },
  currentIndicator: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  currentIndicatorText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  currentItemTitle: {
    color: '#FFFFFF',
  },
  itemDetails: {
    gap: 4,
  },
  itemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  currentItemDetailText: {
    color: 'rgba(255,255,255,0.9)',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyDay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyDayText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  addEventContainer: {
    marginBottom: 24,
  },
  addEventButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addEventGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  addEventText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});