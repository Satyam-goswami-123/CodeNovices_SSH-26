import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { getGeminiResponse } from '@/src/lib/gemini';

// Global type declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef<string>('');

  useEffect(() => {
    // Initialize SpeechRecognition object cross-browser
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening...');
    };

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          currentTranscript += result[0].transcript;
        } else {
          currentTranscript += result[0].transcript;
        }
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setTranscript('Microphone access denied. Please allow microphone permissions.');
      } else {
        setTranscript(`Error: ${event.error}`);
      }
      setTimeout(() => setIsListening(false), 2000);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (lastTranscriptRef.current && lastTranscriptRef.current.trim()) {
        processVoiceCommand(lastTranscriptRef.current);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!isSupported) {
      alert("Your browser doesn't support Web Speech API. Please try using Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        setTranscript('Starting...');
        recognitionRef.current?.start();
      } catch (error) {
        console.error("Failed to start recognition", error);
        setIsListening(false);
      }
    }
  };

  const processVoiceCommand = async (command: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTranscript(`Thinking about: "${command}"...`);

    const systemPrompt = `You are the Voice Assistant for the Fintech E-Governance Portal. 
    A citizen named CodeNovices is speaking to you. Keep your responses very short (maximum 2 sentences) because they will be read aloud. 
    Be helpful and professional. You can answer questions about tax, schemes, and documents.`;

    try {
      const response = await getGeminiResponse(command, systemPrompt);
      setTranscript(response);
      speakResponse(response);
    } catch (error) {
      console.error("Voice processing error", error);
      setTranscript("Sorry, I couldn't process that right now.");
    } finally {
      setIsProcessing(false);
      lastTranscriptRef.current = '';
    }
  };

  const speakResponse = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Add intermediate transcript update to ref
  useEffect(() => {
    if (transcript && isListening && !transcript.startsWith('Listening')) {
      lastTranscriptRef.current = transcript;
    }
  }, [transcript, isListening]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {(isListening || transcript || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white dark:bg-zinc-800 p-4 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 max-w-xs"
          >
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {transcript || (isListening ? 'Listening...' : '')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={toggleListening}
        className={cn(
          "p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center relative",
          isListening
            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
            : "bg-blue-600 hover:bg-blue-700 text-white",
          !isSupported && "bg-zinc-400 hover:bg-zinc-500 cursor-not-allowed opacity-80"
        )}
        title={!isSupported ? "Voice recognition not supported in your browser" : isListening ? "Stop listening" : "Start Voice Assistant"}
      >
        {!isSupported && (
          <span className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border-2 border-white dark:border-zinc-900">
            <AlertCircle size={10} />
          </span>
        )}
        {isListening ? <MicOff size={24} /> : isProcessing ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Mic size={24} />}
      </button>
    </div>
  );
}
