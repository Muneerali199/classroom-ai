import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Mail, 
  Lock, 
  User, 
  Building, 
  Eye, 
  EyeOff, 
  ArrowRight,
  GraduationCap 
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

type AuthMode = 'login' | 'register';
type UserRole = 'student' | 'teacher' | 'admin';

interface RoleOption {
  id: UserRole;
  label: string;
  icon: any;
}

export default function AuthScreen() {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    institution: '',
    role: 'student' as UserRole,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      let success = false;
      
      if (mode === 'login') {
        success = await login(formData.email, formData.password);
      } else {
        if (!formData.name || !formData.institution) {
          Alert.alert('Error', 'Please fill in all fields');
          return;
        }
        success = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          institution: formData.institution,
          role: formData.role,
        });
      }

      if (success) {
        // Navigation will be handled automatically by the layout
        console.log('Authentication successful');
      } else {
        Alert.alert('Error', mode === 'login' ? 'Invalid credentials' : 'Registration failed');
      }

    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setFormData({
      email: '',
      password: '',
      name: '',
      institution: '',
      role: 'student',
    });
  };

  const roles: RoleOption[] = [
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'teacher', label: 'Teacher', icon: User },
    { id: 'admin', label: 'Admin', icon: Building },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
            <Text style={styles.title}>
              {mode === 'login' ? 'Welcome Back' : 'Join Us'}
            </Text>
            <Text style={styles.subtitle}>
              {mode === 'login' 
                ? 'Sign in to your educational platform' 
                : 'Create your account to get started'
              }
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
              style={styles.formCard}
            >
              {/* Name Field (Register only) */}
              {mode === 'register' && (
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <User color="rgba(255,255,255,0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="rgba(255,255,255,0.7)"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              {/* Email Field */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Mail color="rgba(255,255,255,0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Lock color="rgba(255,255,255,0.7)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    {showPassword ? (
                      <EyeOff color="rgba(255,255,255,0.7)" size={20} />
                    ) : (
                      <Eye color="rgba(255,255,255,0.7)" size={20} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Institution Field (Register only) */}
              {mode === 'register' && (
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Building color="rgba(255,255,255,0.7)" size={20} />
                    <TextInput
                      style={styles.input}
                      placeholder="Institution Name"
                      placeholderTextColor="rgba(255,255,255,0.7)"
                      value={formData.institution}
                      onChangeText={(text) => setFormData({ ...formData, institution: text })}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              {/* Role Selection (Register only) */}
              {mode === 'register' && (
                <View style={styles.roleContainer}>
                  <Text style={styles.roleLabel}>Select Your Role</Text>
                  <View style={styles.roleButtons}>
                    {roles.map((role) => (
                      <TouchableOpacity
                        key={role.id}
                        style={[
                          styles.roleButton,
                          formData.role === role.id && styles.roleButtonActive,
                        ]}
                        onPress={() => setFormData({ ...formData, role: role.id as UserRole })}
                      >
                        <role.icon 
                          color={formData.role === role.id ? '#667eea' : 'rgba(255,255,255,0.7)'} 
                          size={20} 
                        />
                        <Text
                          style={[
                            styles.roleButtonText,
                            formData.role === role.id && styles.roleButtonTextActive,
                          ]}
                        >
                          {role.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.1)']}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitText}>
                    {isLoading 
                      ? (mode === 'login' ? 'Signing In...' : 'Creating Account...') 
                      : (mode === 'login' ? 'Sign In' : 'Create Account')
                    }
                  </Text>
                  {!isLoading && <ArrowRight color="white" size={20} />}
                </LinearGradient>
              </TouchableOpacity>

              {/* Mode Switch */}
              <View style={styles.switchContainer}>
                <Text style={styles.switchText}>
                  {mode === 'login' 
                    ? "Don't have an account? " 
                    : "Already have an account? "
                  }
                </Text>
                <TouchableOpacity onPress={switchMode}>
                  <Text style={styles.switchLink}>
                    {mode === 'login' ? 'Sign Up' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={[
              styles.footer,
              {
                opacity: fadeAnim,
              },
            ]}
          >
            <Text style={styles.footerText}>
              Secure • Institution-Controlled • Privacy-First
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: { marginBottom: 30 },
  formCard: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  inputContainer: { marginBottom: 20 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  input: { flex: 1, color: 'white', fontSize: 16, paddingVertical: 12, paddingLeft: 12 },
  eyeButton: { padding: 4 },
  roleContainer: { marginBottom: 20 },
  roleLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  roleButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  roleButtonActive: { backgroundColor: 'rgba(255,255,255,0.9)' },
  roleButtonText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  roleButtonTextActive: { color: '#667eea' },
  submitButton: { borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  submitText: { color: 'white', fontSize: 16, fontWeight: '600', marginRight: 8 },
  switchContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  switchText: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  switchLink: { color: 'white', fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' },
  footer: { alignItems: 'center', marginTop: 20 },
  footerText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center' },
});