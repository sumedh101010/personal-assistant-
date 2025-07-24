import React from 'react';

interface VoiceWaveformProps {
  isActive: boolean;
  type: 'listening' | 'speaking';
  isDark?: boolean;
}

const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isActive, type, isDark = true }) => {
  const bars = Array.from({ length: 5 }, (_, i) => i);
  
  return (
    <div className="flex items-center justify-center space-x-1 h-12">
      {bars.map((bar) => (
        <div
          key={bar}
          className={`w-1 bg-gradient-to-t transition-all duration-150 rounded-full ${
            type === 'listening'
              ? isDark 
                ? 'from-red-400 to-red-600' 
                : 'from-red-500 to-red-700'
              : isDark
                ? 'from-blue-400 to-blue-600'
                : 'from-blue-500 to-blue-700'
          } ${
            isActive 
              ? 'animate-pulse' 
              : 'opacity-30'
          }`}
          style={{
            height: isActive 
              ? `${Math.random() * 20 + 10}px`
              : '4px',
            animationDelay: `${bar * 0.1}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;