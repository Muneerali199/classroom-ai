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
  BookOpen,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
} from 'lucide-react-native';
import { useTimetable } from '@/contexts/TimetableContext';
import { Subject } from '@/types/timetable';

export default function SubjectManagementScreen() {
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useTimetable();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: '',
    type: 'lecture' as 'lecture' | 'lab' | 'tutorial',
    facultyId: '',
    maxClassesPerWeek: '',
    maxClassesPerDay: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      credits: '',
      type: 'lecture',
      facultyId: '',
      maxClassesPerWeek: '',
      maxClassesPerDay: '',
    });
    setEditingSubject(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const openEditModal = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      credits: subject.credits.toString(),
      type: subject.type,
      facultyId: subject.facultyId,
      maxClassesPerWeek: subject.maxClassesPerWeek.toString(),
      maxClassesPerDay: subject.maxClassesPerDay.toString(),
    });
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.code.trim()) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const subjectData: Subject = {
      id: editingSubject?.id || Date.now().toString(),
      name: formData.name.trim(),
      code: formData.code.trim(),
      credits: parseInt(formData.credits) || 1,
      type: formData.type,
      facultyId: formData.facultyId,
      maxClassesPerWeek: parseInt(formData.maxClassesPerWeek) || 3,
      maxClassesPerDay: parseInt(formData.maxClassesPerDay) || 1,
    };

    if (editingSubject) {
      dispatch({ type: 'UPDATE_SUBJECT', payload: subjectData });
    } else {
      dispatch({ type: 'ADD_SUBJECT', payload: subjectData });
    }

    setIsModalVisible(false);
    resetForm();
  };

  const handleDelete = (subjectId: string) => {
    Alert.alert(
      'Delete Subject',
      'Are you sure you want to delete this subject?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => dispatch({ type: 'DELETE_SUBJECT', payload: subjectId }),
        },
      ]
    );
  };

  const getFacultyName = (facultyId: string) => {
    const faculty = state.faculty.find(f => f.id === facultyId);
    return faculty ? faculty.name : 'Not assigned';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Subject Management</Text>
        <Text style={styles.headerSubtitle}>
          Configure subjects and course details
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
            <Text style={styles.addButtonText}>Add New Subject</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Subjects List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subjects ({state.subjects.length})</Text>

          {state.subjects.length === 0 ? (
            <View style={styles.emptyState}>
              <BookOpen size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>No subjects added yet</Text>
              <Text style={styles.emptyStateSubtitle}>
                Add your first subject to get started with course configuration.
              </Text>
            </View>
          ) : (
            state.subjects.map((subject) => (
              <View key={subject.id} style={styles.subjectCard}>
                <LinearGradient
                  colors={['#F8FAFC', '#F1F5F9']}
                  style={styles.subjectCardGradient}
                >
                  <View style={styles.subjectHeader}>
                    <View style={styles.subjectInfo}>
                      <Text style={styles.subjectName}>{subject.name}</Text>
                      <Text style={styles.subjectCode}>{subject.code}</Text>
                    </View>
                    <View style={styles.subjectActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => openEditModal(subject)}
                      >
                        <Edit size={16} color="#3B82F6" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDelete(subject.id)}
                      >
                        <Trash2 size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.subjectDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Type:</Text>
                      <Text style={styles.detailValue}>{subject.type}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Credits:</Text>
                      <Text style={styles.detailValue}>{subject.credits}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Faculty:</Text>
                      <Text style={styles.detailValue}>{getFacultyName(subject.facultyId)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Max/Week:</Text>
                      <Text style={styles.detailValue}>{subject.maxClassesPerWeek}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Max/Day:</Text>
                      <Text style={styles.detailValue}>{subject.maxClassesPerDay}</Text>
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
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
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
                <Text style={styles.inputLabel}>Subject Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, name: value }))}
                  placeholder="e.g., Data Structures"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Subject Code *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.code}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, code: value }))}
                  placeholder="e.g., CS101"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Credits</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.credits}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, credits: value }))}
                  placeholder="e.g., 3"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Type</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.type}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, type: value as 'lecture' | 'lab' | 'tutorial' }))}
                  placeholder="lecture, lab, or tutorial"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Faculty ID</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.facultyId}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, facultyId: value }))}
                  placeholder="Faculty ID (leave empty if not assigned)"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Max Classes Per Week</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.maxClassesPerWeek}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, maxClassesPerWeek: value }))}
                  placeholder="e.g., 3"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Max Classes Per Day</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.maxClassesPerDay}
                  onChangeText={(value) => setFormData(prev => ({ ...prev, maxClassesPerDay: value }))}
                  placeholder="e.g., 1"
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
  subjectCard: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  subjectCardGradient: {
    padding: 16,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subjectCode: {
    fontSize: 14,
    color: '#6B7280',
  },
  subjectActions: {
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
  subjectDetails: {
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
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
