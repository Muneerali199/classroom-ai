import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  Users,
  Activity,
  ChevronRight,
} from 'lucide-react-native';

interface Course {
  id: string;
  title: string;
  description: string | null;
  teacher_id: string;
  created_at: string;
  teacher_name?: string;
  student_count?: number;
  activity_count?: number;
}

export default function CoursesScreen() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
  });

  const role = user?.profile?.role;

  useEffect(() => {
    loadCourses();
  }, [user]);

  const loadCourses = async () => {
    if (!user) return;

    try {
      if (role === 'student') {
        // Load enrolled courses for students
        const { data: enrollments, error: enrollError } = await supabase
          .from('enrollments')
          .select(`
            course_id,
            courses (
              id,
              title,
              description,
              teacher_id,
              created_at,
              profiles!courses_teacher_id_fkey (
                full_name
              )
            )
          `)
          .eq('student_id', user.id);

        if (enrollError) throw enrollError;

        const coursesData = enrollments?.map(enrollment => ({
          ...enrollment.courses,
          teacher_name: enrollment.courses?.profiles?.full_name || 'Unknown Teacher',
        })) || [];

        setCourses(coursesData);
      } else if (role === 'teacher') {
        // Load courses taught by teacher
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            profiles!courses_teacher_id_fkey (
              full_name
            )
          `)
          .eq('teacher_id', user.id);

        if (error) throw error;

        const coursesData = data?.map(course => ({
          ...course,
          teacher_name: course.profiles?.full_name || 'Unknown Teacher',
        })) || [];

        setCourses(coursesData);
      }

      // Load additional stats for each course
      await loadCourseStats();
    } catch (error) {
      console.error('Error loading courses:', error);
      Alert.alert('Error', 'Failed to load courses');
    }
  };

  const loadCourseStats = async () => {
    // This would load student count and activity count for each course
    // Implementation depends on your specific needs
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim()) {
      Alert.alert('Error', 'Please enter a course title');
      return;
    }

    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          title: newCourse.title.trim(),
          description: newCourse.description.trim(),
          teacher_id: user!.id,
        });

      if (error) throw error;

      setNewCourse({ title: '', description: '' });
      setShowCreateModal(false);
      loadCourses();
      Alert.alert('Success', 'Course created successfully');
    } catch (error) {
      console.error('Error creating course:', error);
      Alert.alert('Error', 'Failed to create course');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#1D4ED8']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>
          {role === 'teacher' ? 'My Courses' : 'Enrolled Courses'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
        </Text>
        
        {role === 'teacher' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </LinearGradient>

      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <TouchableOpacity key={course.id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <BookOpen size={20} color="#2563EB" />
                <Text style={styles.courseTitle}>{course.title}</Text>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
              
              {course.description && (
                <Text style={styles.courseDescription} numberOfLines={2}>
                  {course.description}
                </Text>
              )}
              
              <View style={styles.courseFooter}>
                <View style={styles.courseInfo}>
                  <View style={styles.infoItem}>
                    <Users size={14} color="#6B7280" />
                    <Text style={styles.infoText}>
                      {course.student_count || 0} students
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Activity size={14} color="#6B7280" />
                    <Text style={styles.infoText}>
                      {course.activity_count || 0} activities
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.teacherName}>
                  {role === 'student' ? `By ${course.teacher_name}` : 'Your course'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <BookOpen size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No courses found' : 'No courses yet'}
            </Text>
            <Text style={styles.emptyText}>
              {role === 'teacher' 
                ? 'Create your first course to get started'
                : 'Enroll in courses to see them here'
              }
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Course</Text>
            <TouchableOpacity onPress={handleCreateCourse}>
              <Text style={styles.saveButton}>Create</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course Title</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter course title"
                value={newCourse.title}
                onChangeText={(text) => setNewCourse(prev => ({ ...prev, title: text }))}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Enter course description"
                value={newCourse.description}
                onChangeText={(text) => setNewCourse(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E5E7EB',
    position: 'absolute',
    bottom: 24,
    left: 24,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: -12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  courseDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseInfo: {
    flexDirection: 'row',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  teacherName: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },
  modalContent: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});