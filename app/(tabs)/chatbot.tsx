import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {

  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Sparkles,
  Volume2,
  VolumeX,
  Settings,
  Zap,
  Brain,

  Copy,
  RotateCcw,
  X,
} from 'lucide-react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'image';
  imageUrl?: string;
  aiProvider?: string;
}

interface AIProvider {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: [string, string];
  capabilities: string[];
}

const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Advanced reasoning and analysis',
    icon: Brain,
    color: ['#10B981', '#059669'],
    capabilities: ['Text Generation', 'Analysis', 'Problem Solving'],
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Helpful, harmless, and honest',
    icon: Sparkles,
    color: ['#8B5CF6', '#7C3AED'],
    capabilities: ['Writing', 'Research', 'Code Review'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Multimodal AI assistant',
    icon: Zap,
    color: ['#3B82F6', '#1D4ED8'],
    capabilities: ['Vision', 'Reasoning', 'Creativity'],
  },
  {
    id: 'llama',
    name: 'Llama 3',
    description: 'Open-source language model',
    icon: Bot,
    color: ['#F59E0B', '#D97706'],
    capabilities: ['Coding', 'Math', 'Reasoning'],
  },
];

const QUICK_SUGGESTIONS = [
  "Help me with my homework",
  "Explain this concept",
  "Create a study plan",
  "Check my grammar",
  "Summarize this text",
  "Generate practice questions",
];

export default function ChatbotScreen() {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello ${user?.name}! I'm your AI assistant. I can help you with academic questions, study tips, schedule management, and more. How can I assist you today?`,
      isUser: false,
      timestamp: new Date(),
      aiProvider: 'gpt-4',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(AI_PROVIDERS[0]);
  const [showProviders, setShowProviders] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant microphone permission to use voice input.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      const uri = recording.getURI();
      if (uri) {
        await transcribeAudio(uri);
      }
      
      setRecording(null);
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
    } catch (error) {
      console.error('Failed to stop recording:', error);
      Alert.alert('Error', 'Failed to process recording. Please try again.');
    }
  };

  const transcribeAudio = async (uri: string) => {
    try {
      setIsLoading(true);
      
      const formData = new FormData();
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      const audioFile = {
        uri,
        name: `recording.${fileType}`,
        type: `audio/${fileType}`,
      } as any;
      
      formData.append('audio', audioFile);
      
      const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Transcription failed');
      }
      
      const result = await response.json();
      if (result.text) {
        setInputText(result.text);
      }
    } catch (error) {
      console.error('Transcription error:', error);
      Alert.alert('Error', 'Failed to transcribe audio. Please try typing instead.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setShowSuggestions(false);
    setIsTyping(true);

    try {
      // Build conversation context
      const contextMessages = messages.slice(-10).map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
      }));

      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant for ${user?.role === 'student' ? 'a student' : user?.role === 'teacher' ? 'a teacher' : 'a dean'} named ${user?.name} at ${user?.institution}. 
              
              Your capabilities include:
              - Academic help and tutoring
              - Study planning and organization
              - Research assistance
              - Writing and grammar help
              - Math and science problem solving
              - Course planning and scheduling
              - Performance analysis
              - Educational resource recommendations
              
              Provide helpful, accurate, and contextual responses. Be encouraging and supportive. If asked about attendance, grades, or institutional data, remind them to check their dashboard for real-time information.`,
            },
            ...contextMessages,
            {
              role: 'user',
              content: messageText,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const result = await response.json();
      
      // Simulate typing delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: result.completion,
        isUser: false,
        timestamp: new Date(),
        aiProvider: selectedProvider.id,
      };

      setMessages(prev => [...prev, aiMessage]);
      setConversationHistory(prev => [...prev, userMessage, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again. You can try switching to a different AI provider from the settings.',
        isUser: false,
        timestamp: new Date(),
        aiProvider: selectedProvider.id,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const speakMessage = async (text: string) => {
    try {
      if (isSpeaking) {
        Speech.stop();
        setIsSpeaking(false);
        return;
      }

      setIsSpeaking(true);
      await Speech.speak(text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
    }
  };

  const copyMessage = (text: string) => {
    Alert.alert('Copied', 'Message copied to clipboard');
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([
              {
                id: '1',
                text: `Hello ${user?.name}! I'm your AI assistant. How can I help you today?`,
                isUser: false,
                timestamp: new Date(),
                aiProvider: selectedProvider.id,
              },
            ]);
          },
        },
      ]
    );
  };

  const renderMessage = (message: Message) => {
    const isUser = message.isUser;
    const provider = AI_PROVIDERS.find(p => p.id === message.aiProvider) || selectedProvider;
    const ProviderIcon = provider.icon;

    return (
      <Animated.View
        key={message.id}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.aiMessage,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {!isUser && (
          <View style={styles.aiAvatar}>
            <LinearGradient
              colors={provider.color}
              style={styles.aiAvatarGradient}
            >
              <ProviderIcon size={16} color="#FFFFFF" />
            </LinearGradient>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          {
            backgroundColor: isUser 
              ? theme.colors.primary 
              : theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}>
          <Text style={[
            styles.messageText,
            {
              color: isUser ? '#FFFFFF' : theme.colors.text,
            },
          ]}>
            {message.text}
          </Text>
          
          <View style={styles.messageFooter}>
            <Text style={[
              styles.messageTime,
              {
                color: isUser 
                  ? 'rgba(255, 255, 255, 0.7)' 
                  : theme.colors.textSecondary,
              },
            ]}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
            
            {!isUser && (
              <View style={styles.messageActions}>
                <TouchableOpacity
                  style={styles.messageAction}
                  onPress={() => speakMessage(message.text)}
                >
                  {isSpeaking ? (
                    <VolumeX size={12} color={theme.colors.textSecondary} />
                  ) : (
                    <Volume2 size={12} color={theme.colors.textSecondary} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.messageAction}
                  onPress={() => copyMessage(message.text)}
                >
                  <Copy size={12} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        {isUser && (
          <View style={styles.userAvatar}>
            <User size={16} color={theme.colors.primary} />
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <LinearGradient
        colors={isDark ? ['#1F2937', '#111827'] as const : ['#8B5CF6', '#7C3AED'] as const}
        style={[styles.header, { paddingTop: insets.top + 20 }]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Bot size={24} color="#FFFFFF" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>AI Assistant</Text>
              <Text style={styles.headerSubtitle}>
                Powered by {selectedProvider.name}
              </Text>
            </View>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowProviders(!showProviders)}
            >
              <Settings size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.headerButton}
              onPress={clearChat}
            >
              <RotateCcw size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* AI Provider Selection Modal */}
      <Modal
        visible={showProviders}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProviders(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
            <TouchableOpacity onPress={() => setShowProviders(false)}>
              <X size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Select AI Provider
            </Text>
            <View style={styles.spacer} />
          </View>

          <ScrollView style={styles.modalContent}>
            {AI_PROVIDERS.map((provider) => {
              const isSelected = selectedProvider.id === provider.id;
              const ProviderIcon = provider.icon;
              
              return (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.providerOption,
                    {
                      backgroundColor: isSelected 
                        ? theme.colors.primary + '10' 
                        : theme.colors.surface,
                      borderColor: isSelected 
                        ? theme.colors.primary 
                        : theme.colors.border,
                    },
                  ]}
                  onPress={() => {
                    setSelectedProvider(provider);
                    setShowProviders(false);
                  }}
                >
                  <View style={styles.providerLeft}>
                    <LinearGradient
                      colors={provider.color}
                      style={styles.providerIcon}
                    >
                      <ProviderIcon size={20} color="#FFFFFF" />
                    </LinearGradient>
                    <View style={styles.providerInfo}>
                      <Text style={[
                        styles.providerName,
                        { color: isSelected ? theme.colors.primary : theme.colors.text }
                      ]}>
                        {provider.name}
                      </Text>
                      <Text style={[styles.providerDescription, { color: theme.colors.textSecondary }]}>
                        {provider.description}
                      </Text>
                      <View style={styles.capabilitiesContainer}>
                        {provider.capabilities.slice(0, 2).map((capability) => (
                          <View key={capability} style={[styles.capabilityTag, { backgroundColor: provider.color[0] + '20' }]}>
                            <Text style={[styles.capabilityText, { color: provider.color[0] }]}>
                              {capability}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {/* Quick Suggestions */}
        {showSuggestions && messages.length <= 1 && (
          <View style={styles.suggestionsContainer}>
            <Text style={[styles.suggestionsTitle, { color: theme.colors.textSecondary }]}>
              Quick suggestions:
            </Text>
            <View style={styles.suggestionsGrid}>
              {QUICK_SUGGESTIONS.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.suggestionChip,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => sendMessage(suggestion)}
                >
                  <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {messages.map(renderMessage)}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <View style={styles.aiAvatar}>
              <LinearGradient
                colors={selectedProvider.color}
                style={styles.aiAvatarGradient}
              >
                <Bot size={16} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <View style={[
              styles.messageBubble,
              styles.loadingBubble,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
              },
            ]}>
              <View style={styles.typingIndicator}>
                <Animated.View style={[styles.typingDot, { backgroundColor: theme.colors.textSecondary }]} />
                <Animated.View style={[styles.typingDot, { backgroundColor: theme.colors.textSecondary }]} />
                <Animated.View style={[styles.typingDot, { backgroundColor: theme.colors.textSecondary }]} />
              </View>
              <Text style={[styles.typingText, { color: theme.colors.textSecondary }]}>
                {selectedProvider.name} is thinking...
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={[
          styles.inputWrapper,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}>
          <TextInput
            style={[
              styles.textInput,
              { color: theme.colors.text },
            ]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor={theme.colors.textSecondary}
            multiline
            maxLength={1000}
          />
          
          <View style={styles.inputActions}>
            <Animated.View style={[styles.pulseContainer, { transform: [{ scale: pulseAnim }] }]}>
              <TouchableOpacity
                style={[
                  styles.voiceButton,
                  {
                    backgroundColor: isRecording 
                      ? theme.colors.error 
                      : theme.colors.primary + '20',
                  },
                ]}
                onPress={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
              >
                {isRecording ? (
                  <MicOff size={20} color={theme.colors.error} />
                ) : (
                  <Mic size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  backgroundColor: inputText.trim() 
                    ? theme.colors.primary 
                    : theme.colors.textSecondary + '40',
                },
              ]}
              onPress={() => sendMessage()}
              disabled={!inputText.trim() || isLoading}
            >
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  providerOption: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  providerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  providerDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  capabilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  capabilityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  capabilityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 100,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  aiAvatarGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    marginLeft: 8,
    marginBottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  messageTime: {
    fontSize: 12,
  },
  messageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  messageAction: {
    padding: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  loadingBubble: {
    maxWidth: '75%',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    width: 24,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  typingText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  pulseContainer: {
    // Container for pulse animation
  },
});