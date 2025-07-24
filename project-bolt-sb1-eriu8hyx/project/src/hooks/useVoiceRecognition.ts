import { useState, useRef, useCallback } from 'react';

interface UseVoiceRecognitionProps {
  onResult: (transcript: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
  };
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useVoiceRecognition = ({
  onResult,
  onStart,
  onEnd,
  onError,
}: UseVoiceRecognitionProps) => {
  const [listening, setListening] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const recognitionRef = useRef<any>(null);

  // Check and request microphone permission
  const requestMicrophonePermission = useCallback(async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately as we only needed permission
        stream.getTracks().forEach(track => track.stop());
        setPermissionGranted(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPermissionGranted(false);
      onError?.(error);
      return false;
    }
  }, [onError]);

  const isSupported = useCallback(() => {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported()) {
      console.error('Speech recognition not supported');
      onError?.({ error: 'not-supported' });
      return;
    }

    // Request microphone permission first
    if (permissionGranted === null || permissionGranted === false) {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        return;
      }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => {
      setListening(true);
      onStart?.();
    };

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      
      for (let i = event.results.length - 1; i >= 0; i--) {
        if (event.results[i].isFinal) {
          finalTranscript = event.results[i][0].transcript;
          break;
        }
      }
      
      if (finalTranscript) {
        onResult(finalTranscript.trim());
      }
    };

    recognitionRef.current.onend = () => {
      setListening(false);
      onEnd?.();
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
      
      // Handle specific mobile errors
      if (event.error === 'not-allowed' || event.error === 'permission-denied') {
        setPermissionGranted(false);
      }
      
      onError?.(event);
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setListening(false);
      onError?.(error);
    }
  }, [isSupported, onResult, onStart, onEnd, onError, permissionGranted, requestMicrophonePermission]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    listening,
    startListening,
    stopListening,
    isSupported: isSupported(),
    permissionGranted,
    requestMicrophonePermission,
  };
};