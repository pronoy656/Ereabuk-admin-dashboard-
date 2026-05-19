"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

// Define types for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface UseSpeechRecognitionProps {
  language?: string;
  onTranscriptChange?: (text: string, isFinal: boolean) => void;
}

export const useSpeechRecognition = ({ language = 'en-US', onTranscriptChange }: UseSpeechRecognitionProps = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    // Initialize SpeechRecognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      // Process results
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setInterimTranscript(interim);
      
      // Notify parent component
      if (final && onTranscriptChange) {
        onTranscriptChange(final, true);
      } else if (interim && onTranscriptChange) {
        onTranscriptChange(interim, false);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access.');
        setIsListening(false);
        shouldListenRef.current = false;
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setInterimTranscript('');
      if (shouldListenRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e: any) {
          if (e?.name === 'InvalidStateError') {
             setIsListening(true);
          } else {
             setIsListening(false);
          }
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    // If we were already listening before language change, restart
    if (shouldListenRef.current) {
      try { 
        recognition.start(); 
        setIsListening(true); 
      } catch(e: any){
        if (e?.name === 'InvalidStateError') setIsListening(true);
      }
    }

    // Cleanup on unmount or language change
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
    };
  }, [language, onTranscriptChange]); // Re-initialize if language changes

  const startListening = useCallback(() => {
    setError(null);
    shouldListenRef.current = true;
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err: any) {
        if (err?.name === 'InvalidStateError') {
          setIsListening(true);
        } else {
          console.error("Could not start recognition:", err);
        }
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    if (recognitionRef.current && isListening) {
      try { recognitionRef.current.stop(); } catch(e){}
      setIsListening(false);
      setInterimTranscript('');
    }
  }, [isListening]);

  return {
    isListening,
    isSupported,
    error,
    interimTranscript,
    startListening,
    stopListening
  };
};
