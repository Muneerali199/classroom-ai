import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Users, 
  UserPlus, 
  Settings, 
  BookOpen, 
  Shield,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  GraduationCap
} from 'lucide-react-native';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'dean';
  department: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  students: number;
  status: 'active' | 'inactive';
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@university.edu',
    role: 'teacher',
    department: 'Computer Science',
    status: 'active',
    joinDate: '2023-09-01',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@university.edu',
    role: 'student',
    department: 'Engineering',
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@university.edu',
    role: 'teacher',
    department: 'Business',
    status: 'active',
    joinDate: '2023-08-20',
  },
];

const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Advanced Mathematics',
    code: 'MATH301',
    instructor: 'Dr. Smith',
    students: 45,
    status: 'active',
  },
  {
    id: '2',
    name: 'Computer Science Fundamentals',
    code: 'CS101',
    instructor: 'Prof. Johnson',
    students: 120,
    status: 'active',
  },
  {
    id: '3',
    name: 'Business Analytics',
    code: 'BUS205',
    instructor: 'Dr. Brown',
    students: 78,
    status: 'active',
  },
];

export default function ManagementScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [activeTab, setActiveTab] = useState<'users' | 'courses'>('users');
  const [searchQuery, setSearchQuery] = useState('');

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

  const getRoleIcon = (role: 'student' | 'teacher' | 'dean') => {
    switch (role) {
      case 'student':
        return GraduationCap;
      case 'teacher':
        return BookOpen;
      case 'dean':
        return Shield;
      default:
        return Users;
    }
  };

  const getRoleColor = (role: 'student' | 'teacher' | 'dean'): [string, string] => {
    switch (role) {
      case 'student':
        return ['#3B82F6', '#1D4ED8'];
      case 'teacher':
        return ['#10B981', '#059669'];
      case 'dean':
        return ['#8B5CF6', '#7C3AED'];
      default:
        return ['#6B7280', '#4B5563'];
    }
  };

  const getStatusColor = (status: 'active' | 'inactive') => {
    return status === 'active' ? '#10B981' : '#EF4444';
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = mockCourses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#F1F5F9', '#E2E8F0']}
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
          <Text style={styles.title}>Management Center</Text>
          <Text style={styles.subtitle}>
            Manage users, courses, and system settings
          </Text>
        </Animated.View>

        {/* Tab Navigation */}
        <Animated.View
          style={[
            styles.tabContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.tabButtons}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'users' && styles.tabButtonActive]}
              onPress={() => setActiveTab('users')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={activeTab === 'users' ? ['#8B5CF6', '#7C3AED'] : ['transparent', 'transparent']}
                style={styles.tabButtonGradient}
              >
                <Users color={activeTab === 'users' ? 'white' : '#6B7280'} size={20} />
                <Text style={[styles.tabButtonText, activeTab === 'users' && styles.tabButtonTextActive]}>
                  Users
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'courses' && styles.tabButtonActive]}
              onPress={() => setActiveTab('courses')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={activeTab === 'courses' ? ['#8B5CF6', '#7C3AED'] : ['transparent', 'transparent']}
                style={styles.tabButtonGradient}
              >
                <BookOpen color={activeTab === 'courses' ? 'white' : '#6B7280'} size={20} />
                <Text style={[styles.tabButtonText, activeTab === 'courses' && styles.tabButtonTextActive]}>
                  Courses
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View
          style={[
            styles.searchContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']}
            style={styles.searchBar}
          >
            <Search color="#6B7280" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${activeTab}...`}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterButton}>
              <Filter color="#6B7280" size={20} />
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>

        {/* Add Button */}
        <Animated.View
          style={[
            styles.addButtonContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity style={styles.addButton} activeOpacity={0.8}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.addButtonGradient}
            >
              <UserPlus color="white" size={20} />
              <Text style={styles.addButtonText}>
                Add {activeTab === 'users' ? 'User' : 'Course'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Content */}
        <Animated.View
          style={[
            styles.contentSection,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          {activeTab === 'users' ? (
            // Users List
            <View style={styles.listContainer}>
              {filteredUsers.map((user, index) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <Animated.View
                    key={user.id}
                    style={[
                      styles.listItem,
                      {
                        opacity: fadeAnim,
                        transform: [{ translateX: slideAnim }],
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']}
                      style={styles.listItemGradient}
                    >
                      <View style={styles.listItemHeader}>
                        <View style={styles.listItemInfo}>
                          <LinearGradient
                            colors={getRoleColor(user.role)}
                            style={styles.roleIconContainer}
                          >
                            <RoleIcon color="white" size={16} />
                          </LinearGradient>
                          <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                            <Text style={styles.userDepartment}>{user.department}</Text>
                          </View>
                        </View>
                        <View style={styles.listItemActions}>
                          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) }]}>
                            <Text style={styles.statusText}>{user.status}</Text>
                          </View>
                          <TouchableOpacity style={styles.actionButton}>
                            <MoreVertical color="#6B7280" size={16} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.listItemFooter}>
                        <Text style={styles.joinDate}>
                          Joined: {new Date(user.joinDate).toLocaleDateString()}
                        </Text>
                        <View style={styles.actionButtons}>
                          <TouchableOpacity style={styles.editButton}>
                            <Edit color="#3B82F6" size={14} />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.deleteButton}>
                            <Trash2 color="#EF4444" size={14} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </LinearGradient>
                  </Animated.View>
                );
              })}
            </View>
          ) : (
            // Courses List
            <View style={styles.listContainer}>
              {filteredCourses.map((course, index) => (
                <Animated.View
                  key={course.id}
                  style={[
                    styles.listItem,
                    {
                      opacity: fadeAnim,
                      transform: [{ translateX: slideAnim }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.6)']}
                    style={styles.listItemGradient}
                  >
                    <View style={styles.listItemHeader}>
                      <View style={styles.listItemInfo}>
                        <LinearGradient
                          colors={['#F59E0B', '#D97706']}
                          style={styles.roleIconContainer}
                        >
                          <BookOpen color="white" size={16} />
                        </LinearGradient>
                        <View style={styles.courseInfo}>
                          <Text style={styles.courseName}>{course.name}</Text>
                          <Text style={styles.courseCode}>{course.code}</Text>
                          <Text style={styles.courseInstructor}>
                            Instructor: {course.instructor}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.listItemActions}>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(course.status) }]}>
                          <Text style={styles.statusText}>{course.status}</Text>
                        </View>
                        <TouchableOpacity style={styles.actionButton}>
                          <MoreVertical color="#6B7280" size={16} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.listItemFooter}>
                      <Text style={styles.studentCount}>
                        {course.students} Students Enrolled
                      </Text>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.editButton}>
                          <Edit color="#3B82F6" size={14} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.deleteButton}>
                          <Trash2 color="#EF4444" size={14} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </LinearGradient>
                </Animated.View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  tabContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  tabButtons: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabButtonActive: {
    elevation: 2,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tabButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabButtonTextActive: {
    color: 'white',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.2)',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  filterButton: {
    padding: 4,
  },
  addButtonContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 24,
  },
  listContainer: {
    gap: 16,
  },
  listItem: {
    marginBottom: 16,
  },
  listItemGradient: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  listItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  listItemInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  roleIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userDepartment: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  courseCode: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  courseInstructor: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  listItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  actionButton: {
    padding: 4,
  },
  listItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  joinDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  studentCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  deleteButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
});