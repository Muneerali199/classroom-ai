import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, BookOpen, Plus, Search, CreditCard as Edit, Trash2, Crown, User, GraduationCap } from 'lucide-react-native';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  teacher_id: string;
  teacher_name?: string;
  student_count?: number;
}

export default function ManagementScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'courses'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Only allow access for admins
  if (user?.profile?.role !== 'admin') {
    return (
      <View style={styles.container}>
        <View style={styles.accessDenied}>
          <Crown size={48} color="#EF4444" />
          <Text style={styles.accessDeniedTitle}>Access Denied</Text>
          <Text style={styles.accessDeniedText}>
            This section is only available to administrators.
          </Text>
        </View>
      </View>
    );
  }

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else {
      loadCourses();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    }
  };

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_teacher_id_fkey (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const coursesWithTeacher = data?.map(course => ({
        ...course,
        teacher_name: course.profiles?.full_name || 'Unknown Teacher',
      })) || [];

      setCourses(coursesWithTeacher);
    } catch (error) {
      console.error('Error loading courses:', error);
      Alert.alert('Error', 'Failed to load courses');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);

              if (error) throw error;
              
              Alert.alert('Success', 'User deleted successfully');
              loadUsers();
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const handleRoleChange = async (userId: string, newRole: 'student' | 'teacher' | 'admin') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      Alert.alert('Success', 'User role updated successfully');
      loadUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'Failed to update user role');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown size={16} color="#EF4444" />;
      case 'teacher':
        return <GraduationCap size={16} color="#2563EB" />;
      default:
        return <User size={16} color="#6B7280" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#EF4444';
      case 'teacher':
        return '#2563EB';
      default:
        return '#6B7280';
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#EF4444', '#DC2626']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Management</Text>
        <Text style={styles.headerSubtitle}>System Administration</Text>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'users' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('users')}
        >
          <Users size={18} color={activeTab === 'users' ? '#FFFFFF' : '#6B7280'} />
          <Text
            style={[
              styles.tabText,
              activeTab === 'users' && styles.activeTabText,
            ]}
          >
            Users ({users.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'courses' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('courses')}
        >
          <BookOpen size={18} color={activeTab === 'courses' ? '#FFFFFF' : '#6B7280'} />
          <Text
            style={[
              styles.tabText,
              activeTab === 'courses' && styles.activeTabText,
            ]}
          >
            Courses ({courses.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'users' ? (
          <View style={styles.itemsList}>
            {filteredUsers.map((userItem) => (
              <View key={userItem.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    {getRoleIcon(userItem.role)}
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemTitle}>
                        {userItem.full_name || 'No Name'}
                      </Text>
                      <Text style={styles.itemSubtitle}>{userItem.email}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.roleBadge,
                    { backgroundColor: getRoleColor(userItem.role) + '20' }
                  ]}>
                    <Text style={[
                      styles.roleText,
                      { color: getRoleColor(userItem.role) }
                    ]}>
                      {userItem.role}
                    </Text>
                  </View>
                </View>

                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                      Alert.alert(
                        'Change Role',
                        `Select new role for ${userItem.full_name || userItem.email}:`,
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Student',
                            onPress: () => handleRoleChange(userItem.id, 'student'),
                          },
                          {
                            text: 'Teacher',
                            onPress: () => handleRoleChange(userItem.id, 'teacher'),
                          },
                          {
                            text: 'Admin',
                            onPress: () => handleRoleChange(userItem.id, 'admin'),
                          },
                        ]
                      );
                    }}
                  >
                    <Edit size={16} color="#2563EB" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteUser(userItem.id)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.itemsList}>
            {filteredCourses.map((course) => (
              <View key={course.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <BookOpen size={16} color="#2563EB" />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemTitle}>{course.title}</Text>
                      <Text style={styles.itemSubtitle}>
                        Teacher: {course.teacher_name}
                      </Text>
                      {course.description && (
                        <Text style={styles.itemDescription} numberOfLines={2}>
                          {course.description}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.courseStats}>
                  <Text style={styles.statText}>
                    Created: {new Date(course.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {(activeTab === 'users' ? filteredUsers : filteredCourses).length === 0 && (
          <View style={styles.emptyState}>
            {activeTab === 'users' ? (
              <Users size={48} color="#9CA3AF" />
            ) : (
              <BookOpen size={48} color="#9CA3AF" />
            )}
            <Text style={styles.emptyTitle}>
              No {activeTab} found
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? `No ${activeTab} match your search criteria`
                : `No ${activeTab} available yet`
              }
            </Text>
          </View>
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
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FECACA',
    marginTop: 4,
  },
  accessDenied: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  accessDeniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  accessDeniedText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: -12,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#EF4444',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 16,
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
    paddingTop: 16,
  },
  itemsList: {
    paddingBottom: 24,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  itemDetails: {
    marginLeft: 12,
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  itemDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    lineHeight: 16,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  courseStats: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
});