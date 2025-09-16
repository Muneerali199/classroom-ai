import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { getLocales } from 'expo-localization';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ar' | 'hi';

export interface Translations {
  // Common
  welcome: string;
  loading: string;
  error: string;
  success: string;
  cancel: string;
  save: string;
  delete: string;
  edit: string;
  back: string;
  next: string;
  done: string;
  
  // Navigation
  dashboard: string;
  schedule: string;
  grades: string;
  classes: string;
  reports: string;
  analytics: string;
  management: string;
  about: string;
  profile: string;
  settings: string;
  
  // Dashboard
  welcomeBack: string;
  todaysClasses: string;
  recentGrades: string;
  quickActions: string;
  attendance: string;
  gpa: string;
  credits: string;
  assignments: string;
  
  // Profile
  personalInfo: string;
  contactInfo: string;
  academicInfo: string;
  emergencyContact: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  department: string;
  studentId: string;
  employeeId: string;
  
  // Settings
  appearance: string;
  language: string;
  notifications: string;
  privacy: string;
  lightMode: string;
  darkMode: string;
  systemMode: string;
  
  // Attendance
  markAttendance: string;
  attendanceHistory: string;
  present: string;
  absent: string;
  late: string;
  
  // AI Chatbot
  askQuestion: string;
  voiceInput: string;
  listening: string;
  processing: string;
  speakNow: string;
  
  // Errors
  networkError: string;
  validationError: string;
  permissionDenied: string;
}

const translations: Record<SupportedLanguage, Translations> = {
  en: {
    // Common
    welcome: 'Welcome',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    
    // Navigation
    dashboard: 'Dashboard',
    schedule: 'Schedule',
    grades: 'Grades',
    classes: 'Classes',
    reports: 'Reports',
    analytics: 'Analytics',
    management: 'Management',
    about: 'About',
    profile: 'Profile',
    settings: 'Settings',
    
    // Dashboard
    welcomeBack: 'Welcome back',
    todaysClasses: "Today's Classes",
    recentGrades: 'Recent Grades',
    quickActions: 'Quick Actions',
    attendance: 'Attendance',
    gpa: 'GPA',
    credits: 'Credits',
    assignments: 'Assignments',
    
    // Profile
    personalInfo: 'Personal Information',
    contactInfo: 'Contact Information',
    academicInfo: 'Academic Information',
    emergencyContact: 'Emergency Contact',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    dateOfBirth: 'Date of Birth',
    department: 'Department',
    studentId: 'Student ID',
    employeeId: 'Employee ID',
    
    // Settings
    appearance: 'Appearance',
    language: 'Language',
    notifications: 'Notifications',
    privacy: 'Privacy',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    systemMode: 'System Mode',
    
    // Attendance
    markAttendance: 'Mark Attendance',
    attendanceHistory: 'Attendance History',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    
    // AI Chatbot
    askQuestion: 'Ask a question',
    voiceInput: 'Voice Input',
    listening: 'Listening...',
    processing: 'Processing...',
    speakNow: 'Speak now',
    
    // Errors
    networkError: 'Network error occurred',
    validationError: 'Please check your input',
    permissionDenied: 'Permission denied',
  },
  es: {
    // Common
    welcome: 'Bienvenido',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Atrás',
    next: 'Siguiente',
    done: 'Hecho',
    
    // Navigation
    dashboard: 'Panel',
    schedule: 'Horario',
    grades: 'Calificaciones',
    classes: 'Clases',
    reports: 'Informes',
    analytics: 'Análisis',
    management: 'Gestión',
    about: 'Acerca de',
    profile: 'Perfil',
    settings: 'Configuración',
    
    // Dashboard
    welcomeBack: 'Bienvenido de nuevo',
    todaysClasses: 'Clases de Hoy',
    recentGrades: 'Calificaciones Recientes',
    quickActions: 'Acciones Rápidas',
    attendance: 'Asistencia',
    gpa: 'Promedio',
    credits: 'Créditos',
    assignments: 'Tareas',
    
    // Profile
    personalInfo: 'Información Personal',
    contactInfo: 'Información de Contacto',
    academicInfo: 'Información Académica',
    emergencyContact: 'Contacto de Emergencia',
    name: 'Nombre',
    email: 'Correo',
    phone: 'Teléfono',
    address: 'Dirección',
    dateOfBirth: 'Fecha de Nacimiento',
    department: 'Departamento',
    studentId: 'ID de Estudiante',
    employeeId: 'ID de Empleado',
    
    // Settings
    appearance: 'Apariencia',
    language: 'Idioma',
    notifications: 'Notificaciones',
    privacy: 'Privacidad',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    systemMode: 'Modo Sistema',
    
    // Attendance
    markAttendance: 'Marcar Asistencia',
    attendanceHistory: 'Historial de Asistencia',
    present: 'Presente',
    absent: 'Ausente',
    late: 'Tarde',
    
    // AI Chatbot
    askQuestion: 'Hacer una pregunta',
    voiceInput: 'Entrada de Voz',
    listening: 'Escuchando...',
    processing: 'Procesando...',
    speakNow: 'Habla ahora',
    
    // Errors
    networkError: 'Error de red',
    validationError: 'Por favor verifica tu entrada',
    permissionDenied: 'Permiso denegado',
  },
  fr: {
    // Common
    welcome: 'Bienvenue',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    back: 'Retour',
    next: 'Suivant',
    done: 'Terminé',
    
    // Navigation
    dashboard: 'Tableau de bord',
    schedule: 'Horaire',
    grades: 'Notes',
    classes: 'Cours',
    reports: 'Rapports',
    analytics: 'Analyses',
    management: 'Gestion',
    about: 'À propos',
    profile: 'Profil',
    settings: 'Paramètres',
    
    // Dashboard
    welcomeBack: 'Bon retour',
    todaysClasses: "Cours d'aujourd'hui",
    recentGrades: 'Notes récentes',
    quickActions: 'Actions rapides',
    attendance: 'Présence',
    gpa: 'Moyenne',
    credits: 'Crédits',
    assignments: 'Devoirs',
    
    // Profile
    personalInfo: 'Informations personnelles',
    contactInfo: 'Informations de contact',
    academicInfo: 'Informations académiques',
    emergencyContact: 'Contact d\'urgence',
    name: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    address: 'Adresse',
    dateOfBirth: 'Date de naissance',
    department: 'Département',
    studentId: 'ID étudiant',
    employeeId: 'ID employé',
    
    // Settings
    appearance: 'Apparence',
    language: 'Langue',
    notifications: 'Notifications',
    privacy: 'Confidentialité',
    lightMode: 'Mode clair',
    darkMode: 'Mode sombre',
    systemMode: 'Mode système',
    
    // Attendance
    markAttendance: 'Marquer la présence',
    attendanceHistory: 'Historique de présence',
    present: 'Présent',
    absent: 'Absent',
    late: 'En retard',
    
    // AI Chatbot
    askQuestion: 'Poser une question',
    voiceInput: 'Entrée vocale',
    listening: 'Écoute...',
    processing: 'Traitement...',
    speakNow: 'Parlez maintenant',
    
    // Errors
    networkError: 'Erreur réseau',
    validationError: 'Veuillez vérifier votre saisie',
    permissionDenied: 'Permission refusée',
  },
  de: {
    // Common
    welcome: 'Willkommen',
    loading: 'Laden...',
    error: 'Fehler',
    success: 'Erfolg',
    cancel: 'Abbrechen',
    save: 'Speichern',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    back: 'Zurück',
    next: 'Weiter',
    done: 'Fertig',
    
    // Navigation
    dashboard: 'Dashboard',
    schedule: 'Stundenplan',
    grades: 'Noten',
    classes: 'Kurse',
    reports: 'Berichte',
    analytics: 'Analysen',
    management: 'Verwaltung',
    about: 'Über',
    profile: 'Profil',
    settings: 'Einstellungen',
    
    // Dashboard
    welcomeBack: 'Willkommen zurück',
    todaysClasses: 'Heutige Kurse',
    recentGrades: 'Aktuelle Noten',
    quickActions: 'Schnellaktionen',
    attendance: 'Anwesenheit',
    gpa: 'Notendurchschnitt',
    credits: 'Credits',
    assignments: 'Aufgaben',
    
    // Profile
    personalInfo: 'Persönliche Informationen',
    contactInfo: 'Kontaktinformationen',
    academicInfo: 'Akademische Informationen',
    emergencyContact: 'Notfallkontakt',
    name: 'Name',
    email: 'E-Mail',
    phone: 'Telefon',
    address: 'Adresse',
    dateOfBirth: 'Geburtsdatum',
    department: 'Abteilung',
    studentId: 'Studenten-ID',
    employeeId: 'Mitarbeiter-ID',
    
    // Settings
    appearance: 'Erscheinungsbild',
    language: 'Sprache',
    notifications: 'Benachrichtigungen',
    privacy: 'Datenschutz',
    lightMode: 'Heller Modus',
    darkMode: 'Dunkler Modus',
    systemMode: 'System-Modus',
    
    // Attendance
    markAttendance: 'Anwesenheit markieren',
    attendanceHistory: 'Anwesenheitsverlauf',
    present: 'Anwesend',
    absent: 'Abwesend',
    late: 'Verspätet',
    
    // AI Chatbot
    askQuestion: 'Eine Frage stellen',
    voiceInput: 'Spracheingabe',
    listening: 'Zuhören...',
    processing: 'Verarbeitung...',
    speakNow: 'Jetzt sprechen',
    
    // Errors
    networkError: 'Netzwerkfehler',
    validationError: 'Bitte überprüfen Sie Ihre Eingabe',
    permissionDenied: 'Berechtigung verweigert',
  },
  zh: {
    // Common
    welcome: '欢迎',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    back: '返回',
    next: '下一步',
    done: '完成',
    
    // Navigation
    dashboard: '仪表板',
    schedule: '课程表',
    grades: '成绩',
    classes: '课程',
    reports: '报告',
    analytics: '分析',
    management: '管理',
    about: '关于',
    profile: '个人资料',
    settings: '设置',
    
    // Dashboard
    welcomeBack: '欢迎回来',
    todaysClasses: '今日课程',
    recentGrades: '最近成绩',
    quickActions: '快速操作',
    attendance: '出勤',
    gpa: '平均绩点',
    credits: '学分',
    assignments: '作业',
    
    // Profile
    personalInfo: '个人信息',
    contactInfo: '联系信息',
    academicInfo: '学术信息',
    emergencyContact: '紧急联系人',
    name: '姓名',
    email: '邮箱',
    phone: '电话',
    address: '地址',
    dateOfBirth: '出生日期',
    department: '系别',
    studentId: '学号',
    employeeId: '工号',
    
    // Settings
    appearance: '外观',
    language: '语言',
    notifications: '通知',
    privacy: '隐私',
    lightMode: '浅色模式',
    darkMode: '深色模式',
    systemMode: '系统模式',
    
    // Attendance
    markAttendance: '标记出勤',
    attendanceHistory: '出勤历史',
    present: '出席',
    absent: '缺席',
    late: '迟到',
    
    // AI Chatbot
    askQuestion: '提问',
    voiceInput: '语音输入',
    listening: '正在听...',
    processing: '处理中...',
    speakNow: '现在说话',
    
    // Errors
    networkError: '网络错误',
    validationError: '请检查您的输入',
    permissionDenied: '权限被拒绝',
  },
  ja: {
    // Common
    welcome: 'ようこそ',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    cancel: 'キャンセル',
    save: '保存',
    delete: '削除',
    edit: '編集',
    back: '戻る',
    next: '次へ',
    done: '完了',
    
    // Navigation
    dashboard: 'ダッシュボード',
    schedule: 'スケジュール',
    grades: '成績',
    classes: 'クラス',
    reports: 'レポート',
    analytics: '分析',
    management: '管理',
    about: 'について',
    profile: 'プロフィール',
    settings: '設定',
    
    // Dashboard
    welcomeBack: 'おかえりなさい',
    todaysClasses: '今日のクラス',
    recentGrades: '最近の成績',
    quickActions: 'クイックアクション',
    attendance: '出席',
    gpa: 'GPA',
    credits: '単位',
    assignments: '課題',
    
    // Profile
    personalInfo: '個人情報',
    contactInfo: '連絡先情報',
    academicInfo: '学術情報',
    emergencyContact: '緊急連絡先',
    name: '名前',
    email: 'メール',
    phone: '電話',
    address: '住所',
    dateOfBirth: '生年月日',
    department: '学部',
    studentId: '学生ID',
    employeeId: '従業員ID',
    
    // Settings
    appearance: '外観',
    language: '言語',
    notifications: '通知',
    privacy: 'プライバシー',
    lightMode: 'ライトモード',
    darkMode: 'ダークモード',
    systemMode: 'システムモード',
    
    // Attendance
    markAttendance: '出席を記録',
    attendanceHistory: '出席履歴',
    present: '出席',
    absent: '欠席',
    late: '遅刻',
    
    // AI Chatbot
    askQuestion: '質問する',
    voiceInput: '音声入力',
    listening: '聞いています...',
    processing: '処理中...',
    speakNow: '今話してください',
    
    // Errors
    networkError: 'ネットワークエラー',
    validationError: '入力を確認してください',
    permissionDenied: '権限が拒否されました',
  },
  ar: {
    // Common
    welcome: 'مرحباً',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    cancel: 'إلغاء',
    save: 'حفظ',
    delete: 'حذف',
    edit: 'تعديل',
    back: 'رجوع',
    next: 'التالي',
    done: 'تم',
    
    // Navigation
    dashboard: 'لوحة التحكم',
    schedule: 'الجدول',
    grades: 'الدرجات',
    classes: 'الفصول',
    reports: 'التقارير',
    analytics: 'التحليلات',
    management: 'الإدارة',
    about: 'حول',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    
    // Dashboard
    welcomeBack: 'مرحباً بعودتك',
    todaysClasses: 'فصول اليوم',
    recentGrades: 'الدرجات الأخيرة',
    quickActions: 'إجراءات سريعة',
    attendance: 'الحضور',
    gpa: 'المعدل التراكمي',
    credits: 'الساعات المعتمدة',
    assignments: 'المهام',
    
    // Profile
    personalInfo: 'المعلومات الشخصية',
    contactInfo: 'معلومات الاتصال',
    academicInfo: 'المعلومات الأكاديمية',
    emergencyContact: 'جهة الاتصال الطارئة',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    address: 'العنوان',
    dateOfBirth: 'تاريخ الميلاد',
    department: 'القسم',
    studentId: 'رقم الطالب',
    employeeId: 'رقم الموظف',
    
    // Settings
    appearance: 'المظهر',
    language: 'اللغة',
    notifications: 'الإشعارات',
    privacy: 'الخصوصية',
    lightMode: 'الوضع الفاتح',
    darkMode: 'الوضع الداكن',
    systemMode: 'وضع النظام',
    
    // Attendance
    markAttendance: 'تسجيل الحضور',
    attendanceHistory: 'سجل الحضور',
    present: 'حاضر',
    absent: 'غائب',
    late: 'متأخر',
    
    // AI Chatbot
    askQuestion: 'اطرح سؤالاً',
    voiceInput: 'الإدخال الصوتي',
    listening: 'يستمع...',
    processing: 'معالجة...',
    speakNow: 'تحدث الآن',
    
    // Errors
    networkError: 'خطأ في الشبكة',
    validationError: 'يرجى التحقق من المدخلات',
    permissionDenied: 'تم رفض الإذن',
  },
  hi: {
    // Common
    welcome: 'स्वागत है',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    back: 'वापस',
    next: 'अगला',
    done: 'पूर्ण',
    
    // Navigation
    dashboard: 'डैशबोर्ड',
    schedule: 'समय सारणी',
    grades: 'ग्रेड',
    classes: 'कक्षाएं',
    reports: 'रिपोर्ट',
    analytics: 'विश्लेषण',
    management: 'प्रबंधन',
    about: 'के बारे में',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    
    // Dashboard
    welcomeBack: 'वापसी पर स्वागत है',
    todaysClasses: 'आज की कक्षाएं',
    recentGrades: 'हाल के ग्रेड',
    quickActions: 'त्वरित कार्य',
    attendance: 'उपस्थिति',
    gpa: 'जीपीए',
    credits: 'क्रेडिट',
    assignments: 'असाइनमेंट',
    
    // Profile
    personalInfo: 'व्यक्तिगत जानकारी',
    contactInfo: 'संपर्क जानकारी',
    academicInfo: 'शैक्षणिक जानकारी',
    emergencyContact: 'आपातकालीन संपर्क',
    name: 'नाम',
    email: 'ईमेल',
    phone: 'फोन',
    address: 'पता',
    dateOfBirth: 'जन्म तिथि',
    department: 'विभाग',
    studentId: 'छात्र आईडी',
    employeeId: 'कर्मचारी आईडी',
    
    // Settings
    appearance: 'दिखावट',
    language: 'भाषा',
    notifications: 'सूचनाएं',
    privacy: 'गोपनीयता',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    systemMode: 'सिस्टम मोड',
    
    // Attendance
    markAttendance: 'उपस्थिति चिह्नित करें',
    attendanceHistory: 'उपस्थिति इतिहास',
    present: 'उपस्थित',
    absent: 'अनुपस्थित',
    late: 'देर से',
    
    // AI Chatbot
    askQuestion: 'प्रश्न पूछें',
    voiceInput: 'आवाज़ इनपुट',
    listening: 'सुन रहा है...',
    processing: 'प्रसंस्करण...',
    speakNow: 'अब बोलें',
    
    // Errors
    networkError: 'नेटवर्क त्रुटि',
    validationError: 'कृपया अपना इनपुट जांचें',
    permissionDenied: 'अनुमति अस्वीकृत',
  },
};

const LANGUAGE_STORAGE_KEY = 'selected_language';

export const [LocalizationProvider, useLocalization] = createContextHook(() => {
  const deviceLocales = getLocales();
  const deviceLanguage = deviceLocales[0]?.languageCode as SupportedLanguage || 'en';
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(deviceLanguage);
  const [isLoading, setIsLoading] = useState(true);

  const loadLanguage = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (storedLanguage && Object.keys(translations).includes(storedLanguage)) {
        setCurrentLanguage(storedLanguage as SupportedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLanguage();
  }, []);

  const changeLanguage = async (language: SupportedLanguage) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      setCurrentLanguage(language);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  const contextValue = useMemo(() => ({
    currentLanguage,
    changeLanguage,
    t,
    isLoading,
    supportedLanguages: Object.keys(translations) as SupportedLanguage[],
    translations,
  }), [currentLanguage, t, isLoading]);

  return contextValue;
});