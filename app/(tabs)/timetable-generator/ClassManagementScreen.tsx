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
  Users,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
} from 'lucide-react-native';
import { useTimetable } from '@/contexts/TimetableContext';
import { Class } from '@/types/timetable';

export default function ClassManagementScreen() {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useTimetable();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    batch: '',
    semester: '',
    department: '',
    studentCount: '',
    subjects: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      batch: '',
      semester: '',
      department: '',
      studentCount: '',
      subjects: '',
    });
    setEditingClass(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const openEditModal = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      batch: classItem.batch,
      semester: classItem.semester,
      department: classItem.department,
      studentCount: classItem.studentCount.toString(),
      subjects: classItem.subjects.join(', '),
    });
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.batch.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const classData: Class = {
      id: editingClass?.id || Date.now().toString(),
      name: formData.name.trim(),
      batch: formData.batch.trim(),
      semester: formData.semester.trim(),
      department: formData.department.trim(),
      studentCount: parseInt(formData.studentCount) || 0,
      subjects: formData.subjects.split(',').map(s => s.trim()).filter(s => s),
    };

    if (editingClass) {
      dispatch({ type: 'UPDATE_CLASS', payload: classData });
    } else {
      dispatch({ type: 'ADD_CLASS', payload: classData });
    }

    setIsModalVisible(false);
    resetForm();
  };

  const handleDelete = (classId: string) => {
    Alert.alert(
      'Delete Class',
      'Are you sure you want to delete this class?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch({ type: 'DELETE_CLASS', payload: classId }),
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
        <Text style={styles.headerTitle}>Class Management</Text>
        <Text style={styles.headerSubtitle}>
          Manage classes and student batches
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
            <Text style={styles.addButtonText}>Add New Class</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Classes List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Classes ({state.classes.length})</Text>

          {state.classes.length === 0 ? (
            <View style={styles.emptyState}>
              <Users size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No classes added yet</Text>
              <Text style={styles.emptyStateSubtitle}>
                Add your first class to get started with timetable generation.
              </Text>
            </View>
          ) : (
            state.classes.map((classItem) => (
              <View key={classItem.id} style={styles.classCard}>
                <LinearGradient
                  colors={['#F8FAFC', '#F1F5F9']}
                  style={styles.classCardGradient}
                >
                  <View style={styles.classHeader}>
                    <View style={styles.classInfo}>
                      <Text style={styles.className}>{classItem.name}</Text>
                      <Text style={styles.classBatch}>{classItem.batch}</Text>
                    </View>
                    <View style={styles.classActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => openEditModal(classItem)}
                      >
                        <Edit size={16} color="#3B82F6" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDelete(classItem.id)}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.classDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Semester:</Text>
                      <Text style={styles.detailValue}>{classItem.semester}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Department:</Text>
                      <Text style={styles.detailValue}>{classItem.department}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Students:</Text>
                      <Text style={styles.detailValue}>{classItem.studentCount}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Subjects:</Text>
                      <Text style={styles.detailValue}>{classItem.subjects.length}</Text>
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
                {editingClass ? 'Edit Class' : 'Add New Class'}
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
                <Text style={styles.inputLabel}>Class Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
                  placeholder="e.g., Computer Science A"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Batch *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.batch}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, batch: value }))}
                  placeholder="e.g., 2024-2025"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Semester</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.semester}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, semester: value }))}
                  placeholder="e.g., Fall 2024"
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
                <Text style={styles.inputLabel}>Student Count</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.studentCount}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, studentCount: value }))}
                  placeholder="e.g., 30"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Subjects (comma-separated)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.subjects}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, subjects: value }))}
                  placeholder="e.g., Math, Physics, Programming"
                  multiline
                  numberOfLines={3}
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
  classCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  classCardGradient: {
    padding: 16,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  classBatch: {
    fontSize: 14,
    color: '#6B7280',
  },
  classActions: {
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
  classDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
