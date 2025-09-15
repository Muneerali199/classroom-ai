export interface TechStackItem {
  name: string;
  description: string;
  icon: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Mobile' | 'Cloud' | 'DevOps';
  color: [string, string];
}

export const techStack: TechStackItem[] = [
  {
    name: 'React Native',
    description: 'Cross-platform mobile development',
    icon: '📱',
    category: 'Mobile',
    color: ['#61DAFB', '#21759B']
  },
  {
    name: 'Expo',
    description: 'React Native development platform',
    icon: '⚡',
    category: 'Mobile',
    color: ['#000020', '#4630EB']
  },
  {
    name: 'TypeScript',
    description: 'Type-safe JavaScript development',
    icon: '🔷',
    category: 'Frontend',
    color: ['#3178C6', '#235A97']
  },
  {
    name: 'React Query',
    description: 'Server state management',
    icon: '🔄',
    category: 'Frontend',
    color: ['#FF4154', '#FF1744']
  },
  {
    name: 'AsyncStorage',
    description: 'Local data persistence',
    icon: '💾',
    category: 'Mobile',
    color: ['#4CAF50', '#2E7D32']
  },
  {
    name: 'Expo Router',
    description: 'File-based navigation',
    icon: '🗺️',
    category: 'Mobile',
    color: ['#000020', '#4630EB']
  },
  {
    name: 'Linear Gradient',
    description: 'Beautiful gradient backgrounds',
    icon: '🎨',
    category: 'Frontend',
    color: ['#667eea', '#764ba2']
  },
  {
    name: 'Lucide Icons',
    description: 'Beautiful icon library',
    icon: '✨',
    category: 'Frontend',
    color: ['#F59E0B', '#D97706']
  },
  {
    name: 'Gesture Handler',
    description: 'Native gesture recognition',
    icon: '👆',
    category: 'Mobile',
    color: ['#9C27B0', '#7B1FA2']
  },
  {
    name: 'Safe Area Context',
    description: 'Safe area handling',
    icon: '📐',
    category: 'Mobile',
    color: ['#FF9800', '#F57C00']
  }
];

export const getStackByCategory = (category: TechStackItem['category']) => {
  return techStack.filter(item => item.category === category);
};

export const categories: TechStackItem['category'][] = [
  'Mobile',
  'Frontend', 
  'Backend',
  'Database',
  'Cloud',
  'DevOps'
];