import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  UserCheck,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Clock,
} from 'lucide-react-native';
import { useTimetable } from '@/contexts/TimetableContext';
import { Faculty } from '@/types/timetable';

export default function FacultyManagementScreen() {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useTimetable();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    subjects: '',
    leaveDays: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      department: '',
      subjects: '',
      leaveDays: '',
    });
    setEditingFaculty(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const openEditModal = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      email: faculty.email,
      department: faculty.department,
      subjects: faculty.subjects.join(', '),
      leaveDays: faculty.leaveDays.toString(),
    });
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const facultyData: Faculty = {
      id: editingFaculty?.id || Date.now().toString(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      department: formData.department.trim(),
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
      availability: {
        'monday': { start: '09:00', end: '17:00', breaks: ['12:00-13:00'] },
        'tuesday': { start: '09:00', end: '17:00', breaks: ['12:00-13:00'] },
        'wednesday': { start: '09:00', end: '17:00', breaks: ['12:00-13:00'] },
        'thursday': { start: '09:00', end: '17:00', breaks: ['12:00-13:00'] },
        'friday': { start: '09:00', end: '17:00', breaks: ['12:00-13:00'] },
      },
      leaveDays: parseInt(formData.leaveDays) || 0,
    };

    if (editingFaculty) {
      dispatch({ type: 'UPDATE_FACULTY', payload: facultyData });
    } else {
      dispatch({ type: 'ADD_FACULTY', payload: facultyData });
    }

    setIsModalVisible(false);
    resetForm();
  };

  const handleDelete = (facultyId: string) => {
    Alert.alert(
      'Delete Faculty',
      'Are you sure you want to delete this faculty member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch({ type: 'DELETE_FACULTY', payload: facultyId }),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Faculty Management</Text>
        <Text style={styles.headerSubtitle}>
          Manage faculty members and their schedules
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <LinearGradient
            colors={['#10B981', '#059669']}
            style={styles.addButtonGradient}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New Faculty</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Faculty List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Faculty ({state.faculty.length})</Text>

          {state.faculty.length === 0 ? (
            <View style={styles.emptyState}>
              <UserCheck size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No faculty added yet</Text>
              <Text style={styles.emptyStateSubtitle}>
                Add faculty members to assign them to subjects.
              </Text>
            </View>
          ) : (
            state.faculty.map((faculty) => (
              <View key={faculty.id} style={styles.facultyCard}>
                <LinearGradient
                  colors={['#F8FAFC', '#F1F5F9']}
                  style={styles.facultyCardGradient}
                >
                  <View style={styles.facultyHeader}>
                    <View style={styles.facultyInfo}>
                      <Text style={styles.facultyName}>{faculty.name}</Text>
                      <Text style={styles.facultyEmail}>{faculty.email}</Text>
                    </View>
                    <View style={styles.facultyActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => openEditModal(faculty)}
                      >
                        <Edit size={16} color="#3B82F6" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDelete(faculty.id)}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.facultyDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Department:</Text>
                      <Text style={styles.detailValue}>{faculty.department}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Subjects:</Text>
                      <Text style={styles.detailValue}>{faculty.subjects.length}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Leave Days:</Text>
                      <Text style={styles.detailValue}>{faculty.leaveDays}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Availability:</Text>
                      <View style={styles.availabilityContainer}>
                        <Clock size={14} color="#6B7280" />
                        <Text style={styles.detailValue}>Mon-Fri 9AM-5PM</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
              </Text>
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
                  placeholder="e.g., Dr. John Smith"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.email}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, email: value }))}
                  placeholder="e.g., john.smith@university.edu"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Department</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.department}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, department: value }))}
                  placeholder="e.g., Computer Science"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Subjects (comma-separated)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.subjects}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, subjects: value }))}
                  placeholder="e.g., Data Structures, Algorithms, Programming"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Leave Days</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.leaveDays}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, leaveDays: value }))}
                  placeholder="e.g., 2"
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.saveButtonGradient}
                >
                  <Save size={16} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>
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
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  facultyCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  facultyCardGradient: {
    padding: 16,
  },
  facultyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  facultyInfo: {
    flex: 1,
  },
  facultyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  facultyEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  facultyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  facultyDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
