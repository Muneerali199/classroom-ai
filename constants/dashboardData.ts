export interface DashboardStats {
  label: string;
  value: string;
  color: string;
  icon: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: [string, string];
  route?: string;
}

// Student Dashboard Data
export const studentStats: DashboardStats[] = [
  {
    label: 'Attendance Rate',
    value: '94%',
    color: 'from-green-500 to-emerald-600',
    icon: '📊'
  },
  {
    label: 'Classes Today',
    value: '4',
    color: 'from-blue-500 to-cyan-600',
    icon: '📚'
  },
  {
    label: 'Assignments Due',
    value: '2',
    color: 'from-orange-500 to-red-600',
    icon: '📝'
  },
  {
    label: 'GPA',
    value: '3.8',
    color: 'from-purple-500 to-pink-600',
    icon: '🎯'
  }
];

export const studentQuickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Mark Attendance',
    description: 'Check in to your current class',
    icon: '✅',
    color: ['#10B981', '#059669']
  },
  {
    id: '2',
    title: 'View Schedule',
    description: 'See your class timetable',
    icon: '📅',
    color: ['#3B82F6', '#1D4ED8']
  },
  {
    id: '3',
    title: 'Assignments',
    description: 'View pending assignments',
    icon: '📋',
    color: ['#F59E0B', '#D97706']
  },
  {
    id: '4',
    title: 'Grades',
    description: 'Check your academic progress',
    icon: '📈',
    color: ['#8B5CF6', '#7C3AED']
  }
];

// Teacher Dashboard Data
export const teacherStats: DashboardStats[] = [
  {
    label: 'Classes Today',
    value: '6',
    color: 'from-blue-500 to-indigo-600',
    icon: '🏫'
  },
  {
    label: 'Students Present',
    value: '142/156',
    color: 'from-green-500 to-emerald-600',
    icon: '👥'
  },
  {
    label: 'Assignments to Grade',
    value: '23',
    color: 'from-orange-500 to-red-600',
    icon: '📝'
  },
  {
    label: 'Average Attendance',
    value: '91%',
    color: 'from-purple-500 to-pink-600',
    icon: '📊'
  }
];

export const teacherQuickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Take Attendance',
    description: 'Mark attendance for current class',
    icon: '✅',
    color: ['#10B981', '#059669']
  },
  {
    id: '2',
    title: 'Class Schedule',
    description: 'View your teaching schedule',
    icon: '📅',
    color: ['#3B82F6', '#1D4ED8']
  },
  {
    id: '3',
    title: 'Grade Assignments',
    description: 'Review and grade submissions',
    icon: '📊',
    color: ['#F59E0B', '#D97706']
  },
  {
    id: '4',
    title: 'Student Reports',
    description: 'Generate attendance reports',
    icon: '📈',
    color: ['#8B5CF6', '#7C3AED']
  }
];

// Dean Dashboard Data
export const deanStats: DashboardStats[] = [
  {
    label: 'Total Students',
    value: '2,847',
    color: 'from-blue-500 to-indigo-600',
    icon: '👨‍🎓'
  },
  {
    label: 'Faculty Members',
    value: '156',
    color: 'from-green-500 to-emerald-600',
    icon: '👨‍🏫'
  },
  {
    label: 'Overall Attendance',
    value: '89%',
    color: 'from-purple-500 to-pink-600',
    icon: '📊'
  },
  {
    label: 'Active Courses',
    value: '124',
    color: 'from-orange-500 to-red-600',
    icon: '📚'
  }
];

export const deanQuickActions: QuickAction[] = [
  {
    id: '1',
    title: 'Institution Analytics',
    description: 'View comprehensive reports',
    icon: '📊',
    color: ['#10B981', '#059669']
  },
  {
    id: '2',
    title: 'Manage Users',
    description: 'Add/remove students & faculty',
    icon: '👥',
    color: ['#3B82F6', '#1D4ED8']
  },
  {
    id: '3',
    title: 'Course Management',
    description: 'Oversee academic programs',
    icon: '📚',
    color: ['#F59E0B', '#D97706']
  },
  {
    id: '4',
    title: 'System Settings',
    description: 'Configure institutional settings',
    icon: '⚙️',
    color: ['#8B5CF6', '#7C3AED']
  }
];

export const recentActivities = [
  {
    id: '1',
    title: 'Mathematics Class',
    description: 'Attendance marked - 28/30 present',
    time: '2 hours ago',
    type: 'attendance'
  },
  {
    id: '2',
    title: 'Physics Assignment',
    description: 'New assignment uploaded',
    time: '4 hours ago',
    type: 'assignment'
  },
  {
    id: '3',
    title: 'Chemistry Lab',
    description: 'Lab session completed',
    time: '1 day ago',
    type: 'class'
  }
];