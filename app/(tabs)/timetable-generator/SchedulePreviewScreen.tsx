import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Calendar,
  Play,
  RotateCcw,
  Download,
  AlertTriangle,
} from 'lucide-react-native';
import { useTimetable } from '@/contexts/TimetableContext';
import { TimetableSlot, Timetable } from '@/types/timetable';

const { width: screenWidth } = Dimensions.get('window');

export default function SchedulePreviewScreen() {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useTimetable();
  const [selectedDay, setSelectedDay] = useState<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'>('monday');

  const days = useMemo(() => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const, []);
  const timeSlots = useMemo(() => [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ], []);

  const generateTimetable = () => {
    // Simple scheduling algorithm - in a real app, this would use the optimization logic
    const newSlots: TimetableSlot[] = [];

    state.classes.forEach((classItem, classIndex) => {
      classItem.subjects.forEach((subjectName, subjectIndex) => {
        const subject = state.subjects.find(s => s.name === subjectName);
        const faculty = state.faculty.find(f => f.id === subject?.facultyId);
        const room = state.rooms[classIndex % state.rooms.length];

        if (subject && faculty && room) {
          const dayIndex = (classIndex + subjectIndex) % 5;
          const timeIndex = (classIndex + subjectIndex) % (timeSlots.length - 1);

          newSlots.push({
            id: `${classItem.id}-${subject.id}-${days[dayIndex]}-${timeSlots[timeIndex]}`,
            day: days[dayIndex],
            time: timeSlots[timeIndex],
            duration: 60, // 1 hour
            subjectId: subject.id,
            facultyId: faculty.id,
            roomId: room.id,
            classId: classItem.id,
            type: subject.type,
          });
        }
      });
    });

    const newTimetable: Timetable = {
      id: Date.now().toString(),
      title: 'Generated Timetable',
      description: 'Auto-generated timetable',
      department: 'Computer Science',
      semester: 'Fall 2024',
      year: '2024',
      shift: 'MORNING',
      slots: newSlots,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({ type: 'SET_CURRENT_TIMETABLE', payload: newTimetable });
  };

  const clearTimetable = () => {
    dispatch({ type: 'SET_CURRENT_TIMETABLE', payload: null });
  };

  const getSlotForTime = (day: string, time: string) => {
    return state.currentTimetable?.slots.find(
      slot => slot.day === day && slot.time === time
    );
  };

  const getSlotDetails = (slot: TimetableSlot) => {
    const classItem = state.classes.find(c => c.id === slot.classId);
    const subject = state.subjects.find(s => s.id === slot.subjectId);
    const faculty = state.faculty.find(f => f.id === slot.facultyId);
    const room = state.rooms.find(r => r.id === slot.roomId);

    return { classItem, subject, faculty, room };
  };

  const hasConflicts = useMemo(() => {
    const conflicts: string[] = [];

    if (!state.currentTimetable) return conflicts;

    // Check for room conflicts
    timeSlots.forEach(time => {
      days.forEach(day => {
        const slotsAtTime = state.currentTimetable!.slots.filter(
          slot => slot.day === day && slot.time === time
        );

        const roomIds = slotsAtTime.map(slot => slot.roomId);
        if (new Set(roomIds).size !== roomIds.length) {
          conflicts.push(`Room conflict on ${day} at ${time}`);
        }

        const facultyIds = slotsAtTime.map(slot => slot.facultyId);
        if (new Set(facultyIds).size !== facultyIds.length) {
          conflicts.push(`Faculty conflict on ${day} at ${time}`);
        }
      });
    });

    return conflicts;
  }, [state.currentTimetable, days, timeSlots]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Schedule Preview</Text>
        <Text style={styles.headerSubtitle}>
          View and generate your timetable
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={generateTimetable}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.controlButtonGradient}
            >
              <Play size={16} color="#FFFFFF" />
              <Text style={styles.controlButtonText}>Generate</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={clearTimetable}>
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.controlButtonGradient}
            >
              <RotateCcw size={16} color="#FFFFFF" />
              <Text style={styles.controlButtonText}>Clear</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={styles.controlButtonGradient}
            >
              <Download size={16} color="#FFFFFF" />
              <Text style={styles.controlButtonText}>Export</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Conflicts Alert */}
        {hasConflicts.length > 0 && (
          <View style={styles.conflictsAlert}>
            <AlertTriangle size={20} color="#EF4444" />
            <Text style={styles.conflictsTitle}>Conflicts Detected</Text>
            <Text style={styles.conflictsCount}>{hasConflicts.length} conflicts found</Text>
          </View>
        )}

        {/* Day Selector */}
        <View style={styles.daySelector}>
          {days.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                selectedDay === day && styles.dayButtonSelected,
              ]}
              onPress={() => setSelectedDay(day)}
            >
              <Text
                style={[
                  styles.dayButtonText,
                  selectedDay === day && styles.dayButtonTextSelected,
                ]}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Timetable Grid */}
        <View style={styles.timetableContainer}>
          {/* Time Column */}
          <View style={styles.timeColumn}>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Time</Text>
            </View>
            {timeSlots.map((time) => (
              <View key={time} style={styles.timeCell}>
                <Text style={styles.timeText}>{time}</Text>
              </View>
            ))}
          </View>

          {/* Schedule Column */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.scheduleColumn}>
              <View style={styles.headerCell}>
                <Calendar size={20} color="#1F2937" />
                <Text style={styles.headerText}>
                  {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
                </Text>
              </View>

              {timeSlots.map((time) => {
                const slot = getSlotForTime(selectedDay, time);

                return (
                  <View key={time} style={styles.scheduleCell}>
                    {slot ? (
                      <LinearGradient
                        colors={['#EBF4FF', '#DBEAFE']}
                        style={styles.slotCard}
                      >
                        {(() => {
                          const { classItem, subject, faculty, room } = getSlotDetails(slot);
                          return (
                            <View style={styles.slotContent}>
                              <Text style={styles.slotClass}>{classItem?.name}</Text>
                              <Text style={styles.slotSubject}>{subject?.name}</Text>
                              <Text style={styles.slotFaculty}>{faculty?.name}</Text>
                              <Text style={styles.slotRoom}>{room?.name}</Text>
                            </View>
                          );
                        })()}
                      </LinearGradient>
                    ) : (
                      <View style={styles.emptyCell}>
                        <Text style={styles.emptyText}>Free</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Schedule Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{state.currentTimetable?.slots.length || 0}</Text>
              <Text style={styles.statLabel}>Total Slots</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{state.classes.length}</Text>
              <Text style={styles.statLabel}>Classes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{state.subjects.length}</Text>
              <Text style={styles.statLabel}>Subjects</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{hasConflicts.length}</Text>
              <Text style={styles.statLabel}>Conflicts</Text>
            </View>
          </View>
        </View>
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
    paddingVertical: 32,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  controlButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  controlButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  conflictsAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  conflictsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  conflictsCount: {
    fontSize: 14,
    color: '#EF4444',
  },
  daySelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dayButtonSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  dayButtonTextSelected: {
    color: '#3B82F6',
  },
  timetableContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timeColumn: {
    width: 80,
  },
  scheduleColumn: {
    minWidth: screenWidth - 80 - 48,
  },
  headerCell: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 4,
    flexDirection: 'row',
    gap: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  timeCell: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  scheduleCell: {
    height: 80,
    marginBottom: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  slotCard: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
  },
  slotContent: {
    flex: 1,
    justifyContent: 'center',
  },
  slotClass: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 2,
  },
  slotSubject: {
    fontSize: 11,
    color: '#1E40AF',
    marginBottom: 1,
  },
  slotFaculty: {
    fontSize: 10,
    color: '#3730A3',
    marginBottom: 1,
  },
  slotRoom: {
    fontSize: 10,
    color: '#581C87',
  },
  emptyCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});
