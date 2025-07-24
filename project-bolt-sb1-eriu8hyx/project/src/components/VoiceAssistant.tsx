import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Volume2, User, Bot, Settings, Sun, Moon } from 'lucide-react';
import VoiceWaveform from './VoiceWaveform';
import ConversationHistory from './ConversationHistory';
import ThemeToggle from './ThemeToggle';
import MiniWidgets from './MiniWidgets';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { processCommand } from '../utils/commandProcessor';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const VoiceAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { speak, stop: stopSpeaking, speaking } = useSpeechSynthesis();

  const handleVoiceResult = useCallback(async (transcript: string) => {
    const userMessage: Message = {
      id: Date.now() + '-user',
      type: 'user',
      content: transcript,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await processCommand(transcript);
      const assistantMessage: Message = {
        id: Date.now() + '-assistant',
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      setIsSpeaking(true);
      await speak(response);
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error processing command:', error);
      const errorMessage: Message = {
        id: Date.now() + '-error',
        type: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [speak]);

  const handleVoiceError = useCallback((error: any) => {
    let errorMessage = "I'm having trouble with voice recognition. ";
    
    if (error.error === 'not-allowed' || error.error === 'permission-denied') {
      errorMessage += "Please allow microphone access in your browser settings and try again.";
    } else if (error.error === 'not-supported') {
      errorMessage += "Voice recognition is not supported in this browser. Please try using Chrome, Safari, or Edge.";
    } else {
      errorMessage += "Please check your microphone and try again.";
    }
    
    const errorMsg: Message = {
      id: Date.now() + '-error',
      type: 'assistant',
      content: errorMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, errorMsg]);
  }, []);

  const { startListening, stopListening, listening, permissionGranted } = useVoiceRecognition({
    onResult: handleVoiceResult,
    onStart: () => setIsListening(true),
    onEnd: () => setIsListening(false),
    onError: handleVoiceError,
  });

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      if (speaking) {
        stopSpeaking();
        setIsSpeaking(false);
      }
      startListening();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    if (speaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setIsSpeaking(speaking);
  }, [speaking]);

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      {/* Header */}
      <header className={`backdrop-blur-sm border-b p-4 transition-all duration-300 ${
        isDark 
          ? 'bg-white/10 border-white/20' 
          : 'bg-black/5 border-black/10'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isDark 
                ? 'bg-gradient-to-r from-blue-500 to-teal-500' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600'
            }`}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>ARIA</h1>
              <p className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-blue-200' : 'text-blue-600'
              }`}>Adaptive Responsive Intelligence Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            <button
              onClick={clearConversation}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isDark 
                  ? 'bg-white/10 hover:bg-white/20 text-white' 
                  : 'bg-black/10 hover:bg-black/20 text-gray-700'
              }`}
              title="Clear conversation"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* Mini Widgets */}
        <MiniWidgets isDark={isDark} />

        {/* Conversation Area */}
        <div className="flex-1 mb-6">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                  isDark 
                    ? 'bg-gradient-to-r from-blue-500 to-teal-500' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                }`}>
                  <Bot className="w-10 h-10 text-white" />
                </div>
                <h2 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>Hello! I'm ARIA</h2>
                <p className={`mb-6 max-w-md transition-colors duration-300 ${
                  isDark ? 'text-blue-200' : 'text-blue-600'
                }`}>
                  Your Adaptive Responsive Intelligence Assistant. Tap the microphone and speak naturally. 
                  I can help with calculations, time, weather, jokes, and intelligent conversations.
                </p>
                <div className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-blue-300' : 'text-blue-500'
                }`}>
                  Try: "ARIA, what time is it?" or "Calculate 15 times 8"
                </div>
              </div>
            </div>
          ) : (
            <ConversationHistory messages={messages} isDark={isDark} />
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Controls */}
        <div className={`sticky bottom-0 backdrop-blur-sm rounded-2xl border p-6 transition-all duration-300 ${
          isDark 
            ? 'bg-white/5 border-white/20' 
            : 'bg-black/5 border-black/10'
        }`}>
          <div className="flex flex-col items-center space-y-4">
            {/* Voice Waveform */}
            {(isListening || isSpeaking) && (
              <VoiceWaveform 
                isActive={isListening || isSpeaking} 
                type={isListening ? 'listening' : 'speaking'} 
                isDark={isDark}
              />
            )}

            {/* Status Text */}
            <div className="text-center">
              <p className={`font-medium transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Tap to speak'}
              </p>
              <p className={`text-sm mt-1 transition-colors duration-300 ${
                isDark ? 'text-blue-200' : 'text-blue-600'
              }`}>
                {isListening ? 'Say something' : isSpeaking ? 'Assistant is responding' : 'Hold and speak, or tap to start'}
              </p>
            </div>

            {/* Microphone Button */}
            <div className="relative">
              <button
                onClick={toggleListening}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 animate-pulse'
                    : isSpeaking
                    ? 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30'
                    : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 shadow-lg shadow-blue-500/30'
                }`}
                disabled={isSpeaking}
              >
                {isListening ? (
                  <MicOff className="w-7 h-7 text-white" />
                ) : isSpeaking ? (
                  <Volume2 className="w-7 h-7 text-white animate-pulse" />
                ) : (
                  <Mic className="w-7 h-7 text-white" />
                )}
              </button>
              
              {/* Pulse animation for listening state */}
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
              )}
            </div>

            {/* Shortcuts */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <button
                onClick={() => handleVoiceResult('ARIA, what time is it?')}
                className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-blue-600 hover:text-gray-800'
                }`}
              >
                Time
              </button>
              <button
                onClick={() => handleVoiceResult('ARIA, what day is today?')}
                className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-blue-600 hover:text-gray-800'
                }`}
              >
                Date
              </button>
              <button
                onClick={() => handleVoiceResult('ARIA, tell me a joke')}
                className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-blue-600 hover:text-gray-800'
                }`}
              >
                Joke
              </button>
              <button
                onClick={() => handleVoiceResult('ARIA, what can you do?')}
                className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                  isDark 
                    ? 'bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white' 
                    : 'bg-black/10 hover:bg-black/20 text-blue-600 hover:text-gray-800'
                }`}
              >
                Help
              </button>
            </div>
            
            {/* Permission status indicator */}
            {permissionGranted === false && (
              <div className={`mt-2 text-xs text-center transition-colors duration-300 ${
                isDark ? 'text-red-300' : 'text-red-500'
              }`}>
                Microphone access required. Please allow permissions and refresh the page.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoiceAssistant;