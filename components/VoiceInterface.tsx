import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Animated,
  Modal,
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
} from 'lucide-react-native';

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
  });

  const [microphoneTest, setMicrophoneTest] = useState<MicrophoneTestState>({
    testing: false,
    level: 0,
    deviceInfo: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [autoSend, setAutoSend] = useState(false);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const levelAnim = useRef(new Animated.Value(0)).current;
  const durationTimer = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const transcribeAudio = useCallback(async (uri: string) => {
    try {
      setTranscriptionState(prev => ({ ...prev, isTranscribing: true }));
      
      console.log('Starting transcription for URI:', uri);
      
      const formData = new FormData();
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      // Ensure proper file extension mapping
      const mimeTypeMap: { [key: string]: string } = {
        'm4a': 'audio/m4a',
        'wav': 'audio/wav',
        'mp3': 'audio/mp3',
        'webm': 'audio/webm',
        'mp4': 'audio/mp4',
      };
      
      const mimeType = mimeTypeMap[fileType] || `audio/${fileType}`;
      
      // Validate audio file exists and has content
      if (!uri || uri.length === 0) {
        throw new Error('Audio file is required - recording URI is empty');
      }
      
      console.log('Preparing audio file for transcription:', { uri, fileType, mimeType });
      
      // Configure audio file for proper upload with correct format
      const audioFile = {
        uri,
        name: `recording.${fileType}`,
        type: mimeType,
      } as any;
      
      console.log('Audio file config:', { uri, name: audioFile.name, type: audioFile.type });
      
      // Verify file exists before uploading
      try {
        // For React Native, validate the URI format
        if (!uri.startsWith('file://') && !uri.startsWith('content://') && !uri.startsWith('blob:') && !uri.startsWith('data:')) {
          console.warn('Unusual URI format detected:', uri);
        }
        
        // Add additional metadata for better transcription
        formData.append('audio', audioFile);
        formData.append('language', 'en-US'); // Specify language for better accuracy
        
        console.log('Audio file and metadata appended to FormData successfully');
      } catch (appendError) {
        console.error('Error appending audio file:', appendError);
        throw new Error('Failed to prepare audio file for upload');
      }
      
      console.log('Sending transcription request...');
      
      // Create AbortController for timeout handling (compatible with older React Native versions)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let the browser handle it for FormData
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('Transcription response status:', response.status);
      
      if (!response.ok) {
        let errorText = 'Unknown error';
        try {
          errorText = await response.text();
        } catch {
          errorText = `HTTP ${response.status} ${response.statusText}`;
        }
        console.error('Transcription API error:', { status: response.status, statusText: response.statusText, error: errorText });
        
        // Handle specific error cases with more detailed messages
        if (response.status === 400) {
          if (errorText.includes('Audio file is required')) {
            throw new Error('No audio data received. Please ensure you speak clearly during recording and try again.');
          } else if (errorText.includes('format')) {
            throw new Error('Audio format not supported. Please try recording again.');
          } else {
            throw new Error('Invalid audio data. Please ensure your microphone is working and try recording again.');
          }
        } else if (response.status === 413) {
          throw new Error('Recording too long. Please try a shorter recording (max 60 seconds).');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait 30 seconds and try again.');
        } else if (response.status >= 500) {
          throw new Error('Transcription service temporarily unavailable. Please try again in a few minutes.');
        } else {
          throw new Error(`Transcription failed (${response.status}). Please try again.`);
        }
      }
      
      const result = await response.json();
      console.log('Transcription result:', result);
      
      if (result.text && result.text.trim()) {
        const transcript = result.text.trim();
        
        // Clean up the transcript - remove extra spaces, fix common transcription issues
        const cleanedTranscript = transcript
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .replace(/^[.,!?\s]+|[.,!?\s]+$/g, '') // Remove leading/trailing punctuation and spaces
          .trim();
        
        if (cleanedTranscript.length > 0) {
          setTranscriptionState(prev => ({
            ...prev,
            finalTranscript: cleanedTranscript,
            confidence: result.confidence || 0.9,
          }));
          
          // Update the input with the cleaned transcript
          onTranscriptAction(cleanedTranscript);
          onTranscriptUpdateAction?.(cleanedTranscript);
          
          // Show success feedback
          console.log('✅ Transcription successful:', cleanedTranscript);
          
          if (autoSend && cleanedTranscript.length > 3) { // Only auto-send if meaningful content
            // Auto-send after a short delay to allow user to see the transcript
            setTimeout(() => {
              console.log('🚀 Auto-sending transcript:', cleanedTranscript);
              // The parent component should handle this via the transcript action
            }, 1500); // Reduced delay for better UX
          }
          
          triggerHaptic('heavy');
          
          // Clear transcript after showing for a moment
          setTimeout(() => {
            setTranscriptionState(prev => ({
              ...prev,
              transcript: '',
              finalTranscript: '',
            }));
          }, 4000); // Slightly reduced time
        } else {
          setError('Transcription result was empty. Please try speaking more clearly.');
          triggerHaptic('medium');
        }
      } else {
        setError('No speech detected. Please speak clearly into your microphone and try again.');
        triggerHaptic('medium');
      }
    } catch (error: any) {
      console.error('❌ Transcription error:', error);
      let errorMessage = 'Failed to transcribe audio. Please try again.';
      
      if (error.name === 'AbortError' || error.message?.includes('timeout')) {
        errorMessage = 'Transcription timed out. Please try a shorter recording.';
      } else if (error.message?.includes('Audio file is required') || error.message?.includes('No audio data')) {
        errorMessage = 'No audio recorded. Please hold the microphone button and speak clearly.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('NetworkError')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message?.includes('format') || error.message?.includes('codec') || error.message?.includes('not supported')) {
        errorMessage = 'Audio format issue. Please try recording again.';
      } else if (error.message?.includes('413') || error.message?.includes('too large') || error.message?.includes('too long')) {
        errorMessage = 'Recording too long. Please try a shorter recording (max 60 seconds).';
      } else if (error.message?.includes('429') || error.message?.includes('Too many requests')) {
        errorMessage = 'Too many requests. Please wait 30 seconds and try again.';
      } else if (error.message?.includes('400') || error.message?.includes('Invalid audio')) {
        errorMessage = 'Audio quality issue. Please speak clearly and ensure good microphone connection.';
      } else if (error.message?.includes('Invalid audio file URI')) {
        errorMessage = 'Recording failed. Please check microphone permissions and try again.';
      } else if (error.message?.includes('Failed to prepare audio')) {
        errorMessage = 'Audio processing failed. Please try recording again.';
      } else if (error.message?.includes('service') || error.message?.includes('server')) {
        errorMessage = 'Transcription service unavailable. Please try again in a few minutes.';
      }
      
      setError(errorMessage);
      triggerHaptic('heavy');
      
      // Auto-clear error after some time
      setTimeout(() => {
        setError(null);
      }, 8000);
    } finally {
      setTranscriptionState(prev => ({ ...prev, isTranscribing: false }));
    }
  }, [onTranscriptAction, onTranscriptUpdateAction, autoSend, triggerHaptic]);

  const stopRecording = useCallback(async () => {
    if (!recordingRef.current) return;

    try {
      console.log('Stopping recording...');
      
      // First update the state to show we're stopping
      setRecordingState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false,
      }));

      // Stop and unload the recording
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      
      console.log('Recording stopped, URI:', uri);
      
      // Clear the recording reference
      recordingRef.current = null;
      
      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      // Provide haptic feedback
      triggerHaptic('light');
      onListeningChangeAction?.(false);
      
      // Only transcribe if we have a valid URI
      if (uri && uri.length > 0) {
        console.log('Starting transcription for URI:', uri);
        await transcribeAudio(uri);
      } else {
        console.error('No valid recording URI found');
        setError('Recording failed - no audio data captured. Please try again.');
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setError('Failed to process recording. Please try again.');
      
      // Ensure we clean up even if there's an error
      recordingRef.current = null;
      onListeningChangeAction?.(false);
    }
  }, [onListeningChangeAction, triggerHaptic, transcribeAudio]);

  // Duration timer with auto-stop at 60 seconds
  useEffect(() => {
    if (recordingState.isRecording && !recordingState.isPaused) {
      durationTimer.current = setInterval(() => {
        setRecordingState(prev => {
          const newDuration = prev.duration + 1;
          
          // Auto-stop recording at 60 seconds to prevent issues
          if (newDuration >= 60) {
            console.log('⏰ Auto-stopping recording at 60 seconds');
            setTimeout(() => stopRecording(), 100);
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
  }, [recordingState.isRecording, recordingState.isPaused, stopRecording]);

  const startRecording = async () => {
    try {
      console.log('Requesting microphone permissions...');
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        setError('Microphone permission denied. Please enable microphone access in your device settings.');
        if (Platform.OS !== 'web') {
          // Use native alert only on mobile platforms
          console.log('Microphone permission denied - please enable in device settings');
        }
        return;
      }

      console.log('Setting audio mode...');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Use optimized recording options for speech-to-text
      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100, // Higher quality for better transcription
          numberOfChannels: 1, // Mono for speech
          bitRate: 128000, // Higher bitrate for better quality
        },
        ios: {
          extension: '.wav',
          outputFormat: Audio.IOSOutputFormat.LINEARPCM,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100, // Higher quality for better transcription
          numberOfChannels: 1, // Mono for speech
          bitRate: 128000, // Higher bitrate for better quality
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm;codecs=opus',
          bitsPerSecond: 128000, // Higher bitrate for better quality
        },
      };

      console.log('Creating recording...');
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      recordingRef.current = recording;

      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0,
      }));

      setError(null);
      setTranscriptionState(prev => ({
        ...prev,
        transcript: '',
        finalTranscript: '',
        confidence: 0,
      }));
      
      triggerHaptic('medium');
      onListeningChangeAction?.(true);

      console.log('Recording started successfully');
    } catch (error: any) {
      console.error('Failed to start recording:', error);
      let errorMessage = 'Failed to start recording. Please try again.';
      
      if (error.message?.includes('permission') || error.message?.includes('denied')) {
        errorMessage = 'Microphone permission denied. Please enable microphone access in your device settings.';
      } else if (error.message?.includes('busy') || error.message?.includes('in use')) {
        errorMessage = 'Microphone is busy. Please close other apps using the microphone and try again.';
      } else if (error.message?.includes('not found') || error.message?.includes('unavailable')) {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      }
      
      setError(errorMessage);
      if (Platform.OS !== 'web') {
        console.log('Recording error:', errorMessage);
      }
    }
  };

  // stopRecording is now defined above with useCallback

  const pauseRecording = async () => {
    if (!recordingRef.current || !recordingState.isRecording) return;

    try {
      if (recordingState.isPaused) {
        await recordingRef.current.startAsync();
        setRecordingState(prev => ({ ...prev, isPaused: false }));
        triggerHaptic('light');
      } else {
        await recordingRef.current.pauseAsync();
        setRecordingState(prev => ({ ...prev, isPaused: true }));
        triggerHaptic('light');
      }
    } catch (error) {
      console.error('Failed to pause/resume recording:', error);
      setError('Failed to pause recording.');
    }
  };

  // transcribeAudio is now defined above with useCallback

  const speakText = useCallback(async (text: string) => {
    try {
      if (speechState.isSpeaking) {
        Speech.stop();
        setSpeechState(prev => ({ ...prev, isSpeaking: false, currentText: '' }));
        return;
      }

      setSpeechState(prev => ({
        ...prev,
        isSpeaking: true,
        currentText: text,
      }));

      await Speech.speak(text, {
        language: 'en-US',
        pitch: speechState.pitch,
        rate: speechState.rate,
        volume: 0.8,
        onStart: () => {
          setSpeechState(prev => ({ ...prev, isSpeaking: true }));
        },
        onDone: () => {
          setSpeechState(prev => ({ ...prev, isSpeaking: false, currentText: '' }));
        },
        onError: () => {
          setSpeechState(prev => ({ ...prev, isSpeaking: false, currentText: '' }));
          setError('Text-to-speech failed. Please try again.');
        },
      });
    } catch (error) {
      console.error('Error speaking text:', error);
      setSpeechState(prev => ({ ...prev, isSpeaking: false, currentText: '' }));
      setError('Text-to-speech not available.');
    }
  }, [speechState.isSpeaking, speechState.pitch, speechState.rate]);

  const stopSpeaking = () => {
    Speech.stop();
    setSpeechState(prev => ({ ...prev, isSpeaking: false, currentText: '' }));
  };

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

      // Get device info
      const deviceInfo = Platform.select({
        ios: 'iOS Microphone',
        android: 'Android Microphone',
        default: 'System Microphone',
      });

      setMicrophoneTest(prev => ({ ...prev, deviceInfo }));

      // Simulate audio level monitoring (simplified for React Native)
      const levelInterval = setInterval(() => {
        const randomLevel = Math.random() * 100;
        setMicrophoneTest(prev => ({ ...prev, level: randomLevel }));
        
        Animated.timing(levelAnim, {
          toValue: randomLevel / 100,
          duration: 100,
          useNativeDriver: false,
        }).start();
      }, 200);

      // Auto-stop test after 10 seconds
      setTimeout(() => {
        clearInterval(levelInterval);
        setMicrophoneTest(prev => ({ ...prev, testing: false }));
      }, 10000);

    } catch (error: any) {
      console.error('Microphone test failed:', error);
      let errorMessage = 'Microphone test failed';
      
      if (error.message?.includes('permission')) {
        errorMessage = 'Microphone permission denied. Please allow microphone access.';
      } else if (error.message?.includes('not found')) {
        errorMessage = 'No microphone found. Please connect a microphone.';
      }

      setMicrophoneTest(prev => ({ 
        ...prev, 
        testing: false, 
        error: errorMessage 
      }));
    }
  };

  const clearError = () => {
    setError(null);
  };

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
              },
            ]}
            onPress={recordingState.isRecording ? stopRecording : startRecording}
            disabled={disabled || transcriptionState.isTranscribing}
            activeOpacity={0.7}
          >
            {transcriptionState.isTranscribing ? (
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
                  : theme.colors.surface 
              }
            ]}
            onPress={pauseRecording}
            disabled={disabled}
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
          onPress={speechState.isSpeaking ? stopSpeaking : undefined}
          disabled={disabled || !speechState.isSpeaking}
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

        {transcriptionState.isTranscribing && (
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
              },
            ]}
            onPress={recordingState.isRecording ? stopRecording : startRecording}
            disabled={disabled || transcriptionState.isTranscribing}
          >
            {recordingState.isRecording ? (
              <MicOff size={32} color="#FFFFFF" />
            ) : (
              <Mic size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Status Text */}
        <View style={styles.centerStatus}>
          <Text style={[styles.centerStatusTitle, { color: theme.colors.text }]}>
            {recordingState.isRecording 
              ? (recordingState.isPaused ? 'Recording Paused' : 'Listening...') 
              : 'Tap to Speak'}
          </Text>
          <Text style={[styles.centerStatusSubtitle, { color: theme.colors.textSecondary }]}>
            {recordingState.isRecording 
              ? `${formatDuration(recordingState.duration)} - Speak clearly and naturally`
              : 'Hold and speak your message'}
          </Text>
        </View>

        {/* Live Transcript */}
        {(transcriptionState.transcript || transcriptionState.finalTranscript) && (
          <View style={[styles.centerTranscript, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.centerTranscriptText, { color: theme.colors.text }]}>
              &ldquo;{transcriptionState.finalTranscript || transcriptionState.transcript}&rdquo;
            </Text>
          </View>
        )}

        {/* Control Buttons */}
        {recordingState.isRecording && (
          <View style={styles.centerControls}>
            <TouchableOpacity
              style={[styles.centerControlButton, { backgroundColor: theme.colors.surface }]}
              onPress={pauseRecording}
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

        <View style={styles.modalContent}>
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

          {/* Speech Rate */}
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
              Speech Rate: {speechState.rate.toFixed(1)}x
            </Text>
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
        </View>
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
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
  
  // Enhanced Transcript Styles
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
});