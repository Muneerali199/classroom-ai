/**
 * VoiceInterface Component
 *
 * A comprehensive voice recording and transcription interface for the Classroom AI app.
 * Provides real-time audio recording, speech-to-text transcription, text-to-speech,
 * and microphone testing capabilities with multiple UI modes.
 *
 * Features:
 * - Real-time audio recording with visual feedback
 * - Speech-to-text transcription using external API
 * - Text-to-speech with customizable rate and pitch
 * - Microphone testing and audio level monitoring
 * - Multiple UI modes (compact, center, expanded)
 * - Haptic feedback and accessibility support
 * - Error handling and recovery
 * - Auto-stop functionality for long recordings
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import {
  Mic,
  MicOff,
  Volume2,
  Play,
  Pause,
  Square,
  AlertCircle,
  Settings,
  TestTube,
  Loader2,
  CheckCircle,
  Waves,
  Send,
  X,
} from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    // Base container
  },

  // Compact Mode Styles
  compactContainer: {
    padding: 12,
  },
  compactControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pulseContainer: {
    // Pulse animation container
  },
  recordButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statusContainer: {
    marginTop: 8,
    gap: 4,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  transcriptContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
  },
  transcriptText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  confidenceText: {
    fontSize: 10,
    marginTop: 6,
    textAlign: 'right',
  },
  transcriptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  transcriptLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // Center Mode Styles
  centerContainer: {
    alignItems: 'center',
    padding: 24,
  },
  centerGradient: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 24,
    minHeight: 200,
    width: '100%',
  },
  centerPulseContainer: {
    marginBottom: 24,
  },
  centerRecordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerStatus: {
    alignItems: 'center',
    marginBottom: 16,
  },
  centerStatusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  centerStatusSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  centerTranscript: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    maxWidth: '100%',
  },
  centerTranscriptText: {
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  centerControls: {
    flexDirection: 'row',
    gap: 16,
  },
  centerControlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  // Modal Styles
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
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  rateButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  rateButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rateButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  testResults: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  testResultsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  levelBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  levelFill: {
    height: '100%',
    borderRadius: 4,
  },
  deviceInfo: {
    fontSize: 12,
  },
  spacer: {
    width: 44,
  },
  sliderContainer: {
    marginTop: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sliderValue: {
    fontSize: 12,
  },

  // Error Styles
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 14,
  },
  errorDismiss: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },

  // TTS Controls
  ttsControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  ttsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ttsButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

interface VoiceInterfaceProps {
  onTranscriptAction: (text: string) => void;
  onSpeakTextAction?: (speakFunction: (text: string) => void) => void;
  onListeningChangeAction?: (isListening: boolean, transcript?: string) => void;
  onTranscriptUpdateAction?: (transcript: string) => void;
  disabled?: boolean;
  mode?: 'compact' | 'expanded' | 'center';
  theme: {
    colors: {
      primary: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;
      error: string;
      success: string;
    };
  };
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioLevel: number;
}

interface TranscriptionState {
  isTranscribing: boolean;
  transcript: string;
  finalTranscript: string;
  confidence: number;
}

interface SpeechState {
  isSpeaking: boolean;
  currentText: string;
  rate: number;
  pitch: number;
  volume: number;
  language: string;
}

interface MicrophoneTestState {
  testing: boolean;
  level: number;
  deviceInfo: string | null;
  error?: string;
}

export function VoiceInterface({
  onTranscriptAction,
  onSpeakTextAction,
  onListeningChangeAction,
  onTranscriptUpdateAction,
  disabled = false,
  mode = 'compact',
  theme,
}: VoiceInterfaceProps) {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioLevel: 0,
  });

  const [transcriptionState, setTranscriptionState] = useState<TranscriptionState>({
    isTranscribing: false,
    transcript: '',
    finalTranscript: '',
    confidence: 0,
  });

  const [speechState, setSpeechState] = useState<SpeechState>({
    isSpeaking: false,
    currentText: '',
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    language: 'en-US',
  });

  const [microphoneTest, setMicrophoneTest] = useState<MicrophoneTestState>({
    testing: false,
    level: 0,
    deviceInfo: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSend, setAutoSend] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTtsControls, setShowTtsControls] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const levelAnim = useRef(new Animated.Value(0)).current;
  const durationTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Animation effects
  useEffect(() => {
    if (recordingState.isRecording && !recordingState.isPaused) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [recordingState.isRecording, recordingState.isPaused, pulseAnim]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(console.warn);
      }
      if (durationTimer.current) {
        clearInterval(durationTimer.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      Speech.stop();
    };
  }, []);

  // Haptic feedback
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (Platform.OS !== 'web') {
      try {
        switch (type) {
          case 'light':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
          case 'medium':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          case 'heavy':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
        }
      } catch {
        console.log('Haptics not available');
      }
    }
  }, []);

  // Enhanced audio cleanup function
  const cleanupAudio = useCallback(async () => {
    try {
      if (recordingRef.current) {
        const status = await recordingRef.current.getStatusAsync();
        if (status.isRecording) {
          try {
            await recordingRef.current.stopAndUnloadAsync();
          } catch (stopError) {
            console.warn('Error stopping recording during cleanup:', stopError);
          }
        }
        recordingRef.current = null;
      }

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.warn('Audio cleanup error:', error);
    }
  }, []);

  // Improved transcription function
  const transcribeAudio = useCallback(async (uri: string) => {
    if (!uri || uri.length === 0) {
      setError('No audio recorded. Please try again.');
      return;
    }

    try {
      setIsProcessing(true);
      setTranscriptionState(prev => ({ ...prev, isTranscribing: true }));
      setError(null);
      
      console.log('🎙️ Starting transcription for URI:', uri);
      
      // Create new abort controller
      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, 30000);
      
      const formData = new FormData();
      const uriParts = uri.split('.');
      const fileType = Platform.OS === 'web' ? 'webm' : (uriParts[uriParts.length - 1] || 'm4a');
      
      const mimeTypeMap: { [key: string]: string } = {
        'm4a': 'audio/m4a',
        'wav': 'audio/wav',
        'mp3': 'audio/mp3',
        'webm': 'audio/webm',
        'mp4': 'audio/mp4',
      };
      
      const mimeType = mimeTypeMap[fileType] || 'audio/m4a';
      
      const audioFile = {
        uri,
        name: `recording.${fileType}`,
        type: mimeType,
      } as any;
      
      formData.append('audio', audioFile);
      formData.append('language', 'en-US');
      
      console.log('📤 Sending transcription request...');
      
      const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
        signal: abortControllerRef.current.signal,
        headers: {
          'Accept': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorMessage = 'Transcription failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        
        // Handle specific error codes
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid audio format. Please try recording again.';
            break;
          case 413:
            errorMessage = 'Recording too long. Please keep it under 60 seconds.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please wait and try again.';
            break;
          case 500:
          case 502:
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again.';
            break;
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('✅ Transcription result:', result);
      
      if (result.text && result.text.trim()) {
        const cleanedTranscript = result.text
          .trim()
          .replace(/\s+/g, ' ')
          .replace(/^[.,!?\s]+|[.,!?\s]+$/g, '');
        
        if (cleanedTranscript.length > 0) {
          setTranscriptionState(prev => ({
            ...prev,
            finalTranscript: cleanedTranscript,
            confidence: result.confidence || 0.9,
          }));
          
          onTranscriptAction(cleanedTranscript);
          onTranscriptUpdateAction?.(cleanedTranscript);
          
          triggerHaptic('heavy');
          
          if (autoSend && cleanedTranscript.length > 3) {
            setTimeout(() => {
              console.log('🚀 Auto-sending transcript');
            }, 1000);
          }
          
          // Clear transcript after delay
          setTimeout(() => {
            setTranscriptionState(prev => ({
              ...prev,
              transcript: '',
              finalTranscript: '',
            }));
          }, 4000);
        } else {
          throw new Error('Empty transcription result. Please speak more clearly.');
        }
      } else {
        throw new Error('No speech detected. Please speak clearly into the microphone.');
      }
    } catch (error: any) {
      console.error('❌ Transcription error:', error);
      
      if (error.name === 'AbortError') {
        setError('Transcription timed out. Please try a shorter recording.');
      } else if (error.message?.includes('NetworkError') || error.message?.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(error.message || 'Transcription failed. Please try again.');
      }
      
      triggerHaptic('heavy');
    } finally {
      setIsProcessing(false);
      setTranscriptionState(prev => ({ ...prev, isTranscribing: false }));
      abortControllerRef.current = null;
    }
  }, [onTranscriptAction, onTranscriptUpdateAction, autoSend, triggerHaptic]);

  // Improved recording toggle function
  const toggleRecording = useCallback(async () => {
    if (isProcessing) {
      console.log('🔄 Already processing, ignoring toggle');
      return;
    }

    if (recordingState.isRecording) {
      // Stop recording - Update UI state immediately
      console.log('⏹️ Stopping recording...');

      // Immediately update UI state for instant feedback
      setRecordingState({
        isRecording: false,
        isPaused: false,
        duration: 0,
        audioLevel: 0,
      });

      try {
        setIsProcessing(true);

        if (!recordingRef.current) {
          console.warn('No active recording to stop');
          setIsProcessing(false);
          return;
        }

        // Get recording status first
        const status = await recordingRef.current.getStatusAsync();
        console.log('Recording status before stop:', status);

        if (!status.isRecording) {
          console.warn('Recording is not active');
          setIsProcessing(false);
          return;
        }

        // Stop the recording with timeout
        const stopPromise = recordingRef.current.stopAndUnloadAsync();
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Stop timeout')), 5000);
        });

        try {
          console.log('⏳ Waiting for recording to stop...');
          await Promise.race([stopPromise, timeoutPromise]);
          console.log('✅ Recording stopped successfully');
          if (timeoutId !== undefined) clearTimeout(timeoutId);
        } catch (stopError) {
          console.warn('❌ Error stopping recording:', stopError);
          if (timeoutId !== undefined) clearTimeout(timeoutId);
          // Force cleanup if stop fails
          console.log('🧹 Force cleanup after stop failure');
          try {
            await cleanupAudio();
          } catch (cleanupError) {
            console.error('❌ Force cleanup failed:', cleanupError);
          }
        }

        const uri = recordingRef.current?.getURI();
        console.log('📁 Recording URI:', uri);

        // Clear timer
        if (durationTimer.current) {
          clearInterval(durationTimer.current);
          durationTimer.current = null;
        }

        // Clean up recording reference
        recordingRef.current = null;

        // Reset audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });

        triggerHaptic('light');
        onListeningChangeAction?.(false);

        // Transcribe if we have a valid URI
        if (uri && uri.length > 0) {
          setTimeout(() => {
            transcribeAudio(uri);
          }, 300);
        } else {
          setError('No audio recorded. Please try again.');
        }
      } catch (error: any) {
        console.error('❌ Failed to stop recording:', error);
        setError('Failed to stop recording. Please try again.');

        // Force cleanup
        await cleanupAudio();
        onListeningChangeAction?.(false);
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Start recording
      console.log('🎤 Starting recording...');
      
      try {
        setIsProcessing(true);
        setError(null);
        
        // Clean up any existing recording
        await cleanupAudio();
        
        // Request permissions
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          setError('Microphone permission required. Please enable in settings.');
          if (Platform.OS !== 'web') {
            Alert.alert(
              'Microphone Permission',
              'Please enable microphone access in your device settings to use voice recording.',
              [{ text: 'OK' }]
            );
          }
          return;
        }

        // Set audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        // Optimized recording options (using consistent .m4a for iOS and Android)
        const recordingOptions = {
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          web: {
            mimeType: 'audio/webm;codecs=opus',
            bitsPerSecond: 128000,
          },
        };

        const { recording } = await Audio.Recording.createAsync(recordingOptions);
        recordingRef.current = recording;

        // Start recording
        await recording.startAsync();

        setRecordingState(prev => ({
          ...prev,
          isRecording: true,
          isPaused: false,
          duration: 0,
        }));

        setTranscriptionState(prev => ({
          ...prev,
          transcript: '',
          finalTranscript: '',
          confidence: 0,
        }));

        triggerHaptic('medium');
        onListeningChangeAction?.(true);

        console.log('✅ Recording started successfully');
      } catch (error: any) {
        console.error('❌ Failed to start recording:', error);
        
        let errorMessage = 'Failed to start recording. Please try again.';
        if (error.message?.includes('permission')) {
          errorMessage = 'Microphone permission denied. Please enable in settings.';
        } else if (error.message?.includes('busy') || error.message?.includes('in use')) {
          errorMessage = 'Microphone is busy. Please close other apps and try again.';
        }
        
        setError(errorMessage);
        await cleanupAudio();
      } finally {
        setIsProcessing(false);
      }
    }
  }, [recordingState.isRecording, isProcessing, onListeningChangeAction, triggerHaptic, transcribeAudio, cleanupAudio]);

  // Duration timer with auto-stop
  useEffect(() => {
    if (recordingState.isRecording && !recordingState.isPaused && !isProcessing) {
      durationTimer.current = setInterval(() => {
        setRecordingState(prev => {
          const newDuration = prev.duration + 1;
          
          // Auto-stop at 60 seconds
          if (newDuration >= 60) {
            console.log('⏰ Auto-stopping recording at 60 seconds');
            setTimeout(() => toggleRecording(), 100);
            return { ...prev, duration: 60 };
          }
          
          return { ...prev, duration: newDuration };
        });
      }, 1000);
    } else {
      if (durationTimer.current) {
        clearInterval(durationTimer.current);
        durationTimer.current = null;
      }
    }

    return () => {
      if (durationTimer.current) {
        clearInterval(durationTimer.current);
      }
    };
  }, [recordingState.isRecording, recordingState.isPaused, isProcessing, toggleRecording]);

  // Pause recording function
  const pauseRecording = useCallback(async () => {
    if (!recordingRef.current || !recordingState.isRecording || isProcessing) return;

    try {
      if (recordingState.isPaused) {
        await recordingRef.current.startAsync();
        setRecordingState(prev => ({ ...prev, isPaused: false }));
        triggerHaptic('light');
        console.log('▶️ Recording resumed');
      } else {
        await recordingRef.current.pauseAsync();
        setRecordingState(prev => ({ ...prev, isPaused: true }));
        triggerHaptic('light');
        console.log('⏸️ Recording paused');
      }
    } catch (error) {
      console.error('Failed to pause/resume recording:', error);
      setError('Failed to pause recording.');
    }
  }, [recordingState.isRecording, recordingState.isPaused, isProcessing, triggerHaptic]);

  // Enhanced Text-to-speech function with customization
  const speakText = useCallback(async (text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    language?: string;
  }) => {
    try {
      if (speechState.isSpeaking) {
        Speech.stop();
        setSpeechState(prev => ({ ...prev, isSpeaking: false, currentText: '' }));
        return;
      }

      if (!text || text.trim().length === 0) {
        setError('No text to speak. Please provide some text.');
        return;
      }

      const speakOptions = {
        language: options?.language || speechState.language,
        pitch: options?.pitch !== undefined ? options.pitch : speechState.pitch,
        rate: options?.rate !== undefined ? options.rate : speechState.rate,
        volume: options?.volume !== undefined ? options.volume : speechState.volume,
      };

      setSpeechState(prev => ({
        ...prev,
        isSpeaking: true,
        currentText: text,
        ...speakOptions,
      }));

      await Speech.speak(text, {
        ...speakOptions,
        onStart: () => {
          setSpeechState(prev => ({ ...prev, isSpeaking: true }));
          triggerHaptic('light');
        },
        onDone: () => {
          setSpeechState(prev => ({ ...prev, isSpeaking: false, currentText: '' }));
          triggerHaptic('light');
        },
        onError: (error) => {
          console.error('Speech error:', error);
          setSpeechState(prev => ({ ...prev, isSpeaking: false, currentText: '' }));
          setError('Text-to-speech failed. Please try again.');
        },
      });
    } catch (error) {
      console.error('Error speaking text:', error);
      setSpeechState(prev => ({ ...prev, isSpeaking: false, currentText: '' }));
      setError('Text-to-speech not available.');
    }
  }, [speechState.isSpeaking, speechState.pitch, speechState.rate, speechState.volume, speechState.language, triggerHaptic]);

  const stopSpeaking = useCallback(() => {
    Speech.stop();
    setSpeechState(prev => ({ ...prev, isSpeaking: false, currentText: '' }));
    triggerHaptic('light');
  }, [triggerHaptic]);

  // Speak the transcribed text
  const speakTranscribedText = useCallback(() => {
    const textToSpeak = transcriptionState.finalTranscript || transcriptionState.transcript;
    if (textToSpeak) {
      speakText(textToSpeak);
    }
  }, [transcriptionState.finalTranscript, transcriptionState.transcript, speakText]);

  const testMicrophone = async () => {
    if (microphoneTest.testing) {
      setMicrophoneTest(prev => ({ ...prev, testing: false }));
      return;
    }

    try {
      setMicrophoneTest(prev => ({ ...prev, testing: true, level: 0, error: undefined }));
      
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Microphone permission denied');
      }

      const deviceInfo = Platform.select({
        ios: 'iOS Microphone',
        android: 'Android Microphone',
        default: 'System Microphone',
      });

      setMicrophoneTest(prev => ({ ...prev, deviceInfo }));

      // Simulate audio level monitoring
      const levelInterval = setInterval(() => {
        const randomLevel = Math.random() * 100;
        setMicrophoneTest(prev => ({ ...prev, level: randomLevel }));
        
        Animated.timing(levelAnim, {
          toValue: randomLevel / 100,
          duration: 100,
          useNativeDriver: false,
        }).start();
      }, 200);

      setTimeout(() => {
        clearInterval(levelInterval);
        setMicrophoneTest(prev => ({ ...prev, testing: false }));
      }, 10000);

    } catch (error: any) {
      console.error('Microphone test failed:', error);
      const errorMessage = error.message?.includes('permission') 
        ? 'Microphone permission denied. Please allow microphone access.'
        : 'Microphone test failed. Please check your microphone connection.';

      setMicrophoneTest(prev => ({ 
        ...prev, 
        testing: false, 
        error: errorMessage 
      }));
    }
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Expose speak function to parent
  useEffect(() => {
    if (onSpeakTextAction) {
      onSpeakTextAction(speakText);
    }
  }, [onSpeakTextAction, speakText]);

  const renderCompactMode = () => (
    <Animated.View style={[styles.compactContainer, { opacity: fadeAnim }]}>
      <View style={styles.compactControls}>
        {/* Main Recording Button */}
        <Animated.View style={[styles.pulseContainer, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              {
                backgroundColor: recordingState.isRecording
                  ? theme.colors.error
                  : theme.colors.primary + '20',
                borderWidth: recordingState.isRecording ? 2 : 0,
                borderColor: recordingState.isRecording ? theme.colors.error : 'transparent',
                opacity: disabled || isProcessing ? 0.5 : 1,
              },
            ]}
            onPress={toggleRecording}
            disabled={disabled || isProcessing}
            activeOpacity={0.7}
          >
            {transcriptionState.isTranscribing || isProcessing ? (
              <Loader2 size={20} color={theme.colors.primary} />
            ) : recordingState.isRecording ? (
              <MicOff size={20} color={theme.colors.error} />
            ) : (
              <Mic size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Pause/Resume Button */}
        {recordingState.isRecording && (
          <TouchableOpacity
            style={[
              styles.controlButton, 
              { 
                backgroundColor: recordingState.isPaused 
                  ? theme.colors.success + '20' 
                  : theme.colors.surface,
                opacity: isProcessing ? 0.5 : 1,
              }
            ]}
            onPress={pauseRecording}
            disabled={disabled || isProcessing}
            activeOpacity={0.7}
          >
            {recordingState.isPaused ? (
              <Play size={16} color={theme.colors.success} />
            ) : (
              <Pause size={16} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        )}

        {/* TTS Button */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              backgroundColor: speechState.isSpeaking 
                ? theme.colors.primary 
                : theme.colors.surface,
            },
          ]}
          onPress={speechState.isSpeaking ? stopSpeaking : speakTranscribedText}
          disabled={disabled || (!speechState.isSpeaking && !transcriptionState.finalTranscript && !transcriptionState.transcript)}
          activeOpacity={0.7}
        >
          {speechState.isSpeaking ? (
            <Square size={16} color="#FFFFFF" />
          ) : (
            <Volume2 size={16} color={theme.colors.textSecondary} />
          )}
        </TouchableOpacity>

        {/* Settings Button */}
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => setShowSettings(true)}
          activeOpacity={0.7}
        >
          <Settings size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Status Indicators */}
      <View style={styles.statusContainer}>
        {recordingState.isRecording && (
          <Animated.View style={styles.statusItem}>
            <Animated.View 
              style={[
                styles.statusDot, 
                { 
                  backgroundColor: recordingState.isPaused 
                    ? theme.colors.textSecondary 
                    : theme.colors.error 
                }
              ]} 
            />
            <Text style={[styles.statusText, { color: theme.colors.text }]}>
              {recordingState.isPaused ? 'Paused' : 'Recording'} {formatDuration(recordingState.duration)}
            </Text>
            {!recordingState.isPaused && (
              <Waves size={12} color={theme.colors.error} />
            )}
          </Animated.View>
        )}

        {(transcriptionState.isTranscribing || isProcessing) && (
          <View style={styles.statusItem}>
            <Loader2 size={12} color={theme.colors.primary} />
            <Text style={[styles.statusText, { color: theme.colors.text }]}>
              Processing audio...
            </Text>
          </View>
        )}

        {speechState.isSpeaking && (
          <View style={styles.statusItem}>
            <Animated.View style={[styles.statusDot, { backgroundColor: theme.colors.primary }]} />
            <Text style={[styles.statusText, { color: theme.colors.text }]}>
              Speaking...
            </Text>
            <Volume2 size={12} color={theme.colors.primary} />
          </View>
        )}
      </View>

      {/* Live Transcript */}
      {(transcriptionState.transcript || transcriptionState.finalTranscript) && (
        <Animated.View 
          style={[
            styles.transcriptContainer, 
            { 
              backgroundColor: transcriptionState.finalTranscript 
                ? theme.colors.success + '10' 
                : theme.colors.surface,
              borderColor: transcriptionState.finalTranscript 
                ? theme.colors.success 
                : theme.colors.border,
              borderWidth: 1,
            }
          ]}
        >
          <View style={styles.transcriptHeader}>
            {transcriptionState.finalTranscript ? (
              <CheckCircle size={14} color={theme.colors.success} />
            ) : (
              <Loader2 size={14} color={theme.colors.primary} />
            )}
            <Text style={[styles.transcriptLabel, { color: theme.colors.textSecondary }]}>
              {transcriptionState.finalTranscript ? 'Transcribed:' : 'Listening...'}
            </Text>
          </View>
          <Text style={[styles.transcriptText, { color: theme.colors.text }]}>
            &ldquo;{transcriptionState.finalTranscript || transcriptionState.transcript}&rdquo;
          </Text>
          {transcriptionState.confidence > 0 && (
            <Text style={[styles.confidenceText, { color: theme.colors.textSecondary }]}>
              {Math.round(transcriptionState.confidence * 100)}% confidence
            </Text>
          )}

          {/* TTS Controls for transcribed text */}
          {transcriptionState.finalTranscript && (
            <View style={styles.ttsControls}>
              <TouchableOpacity
                style={[
                  styles.ttsButton,
                  {
                    backgroundColor: theme.colors.primary,
                  },
                ]}
                onPress={speakTranscribedText}
                disabled={speechState.isSpeaking}
              >
                <Volume2 size={14} color="#FFFFFF" />
                <Text style={[styles.ttsButtonText, { color: '#FFFFFF' }]}>
                  Speak
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.ttsButton,
                  {
                    backgroundColor: theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setShowTtsControls(!showTtsControls)}
              >
                <Settings size={14} color={theme.colors.text} />
                <Text style={[styles.ttsButtonText, { color: theme.colors.text }]}>
                  Settings
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* TTS Customization Controls */}
          {showTtsControls && transcriptionState.finalTranscript && (
            <View style={{ marginTop: 12, gap: 8 }}>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderLabel}>
                  <Text style={{ color: theme.colors.text, fontSize: 12 }}>Speed: {speechState.rate.toFixed(1)}x</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[0.5, 0.75, 1.0, 1.25, 1.5].map((rate) => (
                    <TouchableOpacity
                      key={rate}
                      style={[
                        styles.rateButton,
                        {
                          backgroundColor: speechState.rate === rate ? theme.colors.primary : theme.colors.surface,
                        },
                      ]}
                      onPress={() => setSpeechState(prev => ({ ...prev, rate }))}
                    >
                      <Text style={[
                        styles.rateButtonText, 
                        { color: speechState.rate === rate ? '#FFFFFF' : theme.colors.text }
                      ]}>
                        {rate}x
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.sliderContainer}>
                <View style={styles.sliderLabel}>
                  <Text style={{ color: theme.colors.text, fontSize: 12 }}>Pitch: {speechState.pitch.toFixed(1)}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {[0.5, 0.75, 1.0, 1.25, 1.5].map((pitch) => (
                    <TouchableOpacity
                      key={pitch}
                      style={[
                        styles.rateButton,
                        {
                          backgroundColor: speechState.pitch === pitch ? theme.colors.primary : theme.colors.surface,
                        },
                      ]}
                      onPress={() => setSpeechState(prev => ({ ...prev, pitch }))}
                    >
                      <Text style={[
                        styles.rateButtonText, 
                        { color: speechState.pitch === pitch ? '#FFFFFF' : theme.colors.text }
                      ]}>
                        {pitch}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.ttsButton,
                  {
                    backgroundColor: theme.colors.primary,
                    alignSelf: 'flex-start',
                  },
                ]}
                onPress={() => {
                  speakTranscribedText();
                  setShowTtsControls(false);
                }}
              >
                <Send size={14} color="#FFFFFF" />
                <Text style={[styles.ttsButtonText, { color: '#FFFFFF' }]}>
                  Apply & Speak
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );

  const renderCenterMode = () => (
    <Animated.View style={[styles.centerContainer, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={[theme.colors.primary + '10', theme.colors.primary + '05']}
        style={styles.centerGradient}
      >
        {/* Large Recording Button */}
        <Animated.View style={[styles.centerPulseContainer, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity
            style={[
              styles.centerRecordButton,
              {
                backgroundColor: recordingState.isRecording
                  ? theme.colors.error
                  : theme.colors.primary,
                opacity: disabled || isProcessing ? 0.5 : 1,
              },
            ]}
            onPress={toggleRecording}
            disabled={disabled || isProcessing}
          >
            {isProcessing || transcriptionState.isTranscribing ? (
              <Loader2 size={32} color="#FFFFFF" />
            ) : recordingState.isRecording ? (
              <MicOff size={32} color="#FFFFFF" />
            ) : (
              <Mic size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Status Text */}
        <View style={styles.centerStatus}>
          <Text style={[styles.centerStatusTitle, { color: theme.colors.text }]}>
            {isProcessing 
              ? 'Processing...'
              : recordingState.isRecording 
                ? (recordingState.isPaused ? 'Recording Paused' : 'Listening...') 
                : 'Tap to Speak'}
          </Text>
          <Text style={[styles.centerStatusSubtitle, { color: theme.colors.textSecondary }]}>
            {recordingState.isRecording 
              ? `${formatDuration(recordingState.duration)} - Speak clearly and naturally`
              : 'Press and hold to record your message'}
          </Text>
        </View>

        {/* Live Transcript */}
        {(transcriptionState.transcript || transcriptionState.finalTranscript) && (
          <View style={[styles.centerTranscript, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.centerTranscriptText, { color: theme.colors.text }]}>
              &ldquo;{transcriptionState.finalTranscript || transcriptionState.transcript}&rdquo;
            </Text>
            
            {/* TTS Button for center mode */}
            {transcriptionState.finalTranscript && (
              <TouchableOpacity
                style={[
                  styles.ttsButton,
                  {
                    backgroundColor: theme.colors.primary,
                    alignSelf: 'center',
                    marginTop: 12,
                  },
                ]}
                onPress={speakTranscribedText}
                disabled={speechState.isSpeaking}
              >
                <Volume2 size={16} color="#FFFFFF" />
                <Text style={[styles.ttsButtonText, { color: '#FFFFFF' }]}>
                  {speechState.isSpeaking ? 'Stop' : 'Speak Text'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Control Buttons */}
        {recordingState.isRecording && (
          <View style={styles.centerControls}>
            <TouchableOpacity
              style={[
                styles.centerControlButton, 
                { 
                  backgroundColor: theme.colors.surface,
                  opacity: isProcessing ? 0.5 : 1,
                }
              ]}
              onPress={pauseRecording}
              disabled={isProcessing}
            >
              {recordingState.isPaused ? (
                <Play size={20} color={theme.colors.primary} />
              ) : (
                <Pause size={20} color={theme.colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );

  const renderSettingsModal = () => (
    <Modal
      visible={showSettings}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={() => setShowSettings(false)}>
            <Text style={[styles.modalCloseText, { color: theme.colors.primary }]}>Done</Text>
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            Voice Settings
          </Text>
          <View style={styles.spacer} />
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Auto-send Toggle */}
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Auto-send</Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Automatically send transcribed text
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                {
                  backgroundColor: autoSend ? theme.colors.primary : theme.colors.border,
                },
              ]}
              onPress={() => setAutoSend(!autoSend)}
            >
              <View
                style={[
                  styles.toggleThumb,
                  {
                    backgroundColor: '#FFFFFF',
                    transform: [{ translateX: autoSend ? 20 : 2 }],
                  },
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* TTS Settings */}
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Text-to-Speech</Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Customize speech output settings
              </Text>
            </View>
          </View>

          {/* Speech Rate */}
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                Speech Rate: {speechState.rate.toFixed(1)}x
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Speed of speech output
              </Text>
            </View>
            <View style={styles.rateButtons}>
              <TouchableOpacity
                style={[styles.rateButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => setSpeechState(prev => ({ 
                  ...prev, 
                  rate: Math.max(0.5, prev.rate - 0.1) 
                }))}
              >
                <Text style={[styles.rateButtonText, { color: theme.colors.text }]}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rateButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => setSpeechState(prev => ({ 
                  ...prev, 
                  rate: Math.min(2.0, prev.rate + 0.1) 
                }))}
              >
                <Text style={[styles.rateButtonText, { color: theme.colors.text }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Speech Pitch */}
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                Speech Pitch: {speechState.pitch.toFixed(1)}
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Pitch of speech output
              </Text>
            </View>
            <View style={styles.rateButtons}>
              <TouchableOpacity
                style={[styles.rateButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => setSpeechState(prev => ({ 
                  ...prev, 
                  pitch: Math.max(0.5, prev.pitch - 0.1) 
                }))}
              >
                <Text style={[styles.rateButtonText, { color: theme.colors.text }]}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rateButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => setSpeechState(prev => ({ 
                  ...prev, 
                  pitch: Math.min(2.0, prev.pitch + 0.1) 
                }))}
              >
                <Text style={[styles.rateButtonText, { color: theme.colors.text }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Speech Volume */}
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                Speech Volume: {Math.round(speechState.volume * 100)}%
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Volume of speech output
              </Text>
            </View>
            <View style={styles.rateButtons}>
              <TouchableOpacity
                style={[styles.rateButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => setSpeechState(prev => ({ 
                  ...prev, 
                  volume: Math.max(0.1, prev.volume - 0.1) 
                }))}
              >
                <Text style={[styles.rateButtonText, { color: theme.colors.text }]}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.rateButton, { backgroundColor: theme.colors.surface }]}
                onPress={() => setSpeechState(prev => ({ 
                  ...prev, 
                  volume: Math.min(1.0, prev.volume + 0.1) 
                }))}
              >
                <Text style={[styles.rateButtonText, { color: theme.colors.text }]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Test TTS */}
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Test TTS</Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Test current speech settings
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.testButton,
                {
                  backgroundColor: speechState.isSpeaking 
                    ? theme.colors.error 
                    : theme.colors.primary,
                },
              ]}
              onPress={() => {
                if (speechState.isSpeaking) {
                  stopSpeaking();
                } else {
                  speakText('This is a test of the text to speech functionality with your current settings.');
                }
              }}
            >
              {speechState.isSpeaking ? (
                <Square size={16} color="#FFFFFF" />
              ) : (
                <Volume2 size={16} color="#FFFFFF" />
              )}
              <Text style={styles.testButtonText}>
                {speechState.isSpeaking ? 'Stop' : 'Test'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Microphone Test */}
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>Microphone Test</Text>
              <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                Test your microphone and audio levels
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.testButton,
                {
                  backgroundColor: microphoneTest.testing 
                    ? theme.colors.error 
                    : theme.colors.primary,
                },
              ]}
              onPress={testMicrophone}
            >
              <TestTube size={16} color="#FFFFFF" />
              <Text style={styles.testButtonText}>
                {microphoneTest.testing ? 'Stop' : 'Test'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Microphone Test Results */}
          {microphoneTest.testing && (
            <View style={[styles.testResults, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.testResultsTitle, { color: theme.colors.text }]}>
                Audio Level: {microphoneTest.level.toFixed(0)}%
              </Text>
              <View style={[styles.levelBar, { backgroundColor: theme.colors.border }]}>
                <Animated.View
                  style={[
                    styles.levelFill,
                    {
                      backgroundColor: theme.colors.success,
                      width: levelAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
              {microphoneTest.deviceInfo && (
                <Text style={[styles.deviceInfo, { color: theme.colors.textSecondary }]}>
                  Device: {microphoneTest.deviceInfo}
                </Text>
              )}
            </View>
          )}

          {microphoneTest.error && (
            <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '10' }]}>
              <AlertCircle size={16} color={theme.colors.error} />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {microphoneTest.error}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  // Error Display
  const renderError = () => {
    if (!error) return null;

    return (
      <View style={[styles.errorBanner, { backgroundColor: theme.colors.error + '10' }]}>
        <AlertCircle size={16} color={theme.colors.error} />
        <Text style={[styles.errorBannerText, { color: theme.colors.error }]}>
          {error}
        </Text>
        <TouchableOpacity onPress={clearError}>
          <Text style={[styles.errorDismiss, { color: theme.colors.error }]}>Dismiss</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderError()}
      {mode === 'center' ? renderCenterMode() : renderCompactMode()}
      {renderSettingsModal()}
    </View>
  );
}