import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Thermometer, Activity, Wifi, Battery } from 'lucide-react';

interface MiniWidgetsProps {
  isDark: boolean;
}

const MiniWidgets: React.FC<MiniWidgetsProps> = ({ isDark }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Battery API (if supported)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    // Network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTemperature = () => {
    // Mock temperature - in a real app, this would come from an API
    return Math.round(20 + Math.random() * 10);
  };

  const widgetBaseClass = `p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-105 ${
    isDark 
      ? 'bg-white/10 border-white/20 text-white' 
      : 'bg-black/5 border-black/10 text-gray-800'
  }`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* Time Widget */}
      <div className={widgetBaseClass}>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <div>
            <div className="text-lg font-bold">{formatTime(currentTime)}</div>
            <div className="text-xs opacity-70">Time</div>
          </div>
        </div>
      </div>

      {/* Date Widget */}
      <div className={widgetBaseClass}>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-green-400" />
          <div>
            <div className="text-sm font-bold">{formatDate(currentTime)}</div>
            <div className="text-xs opacity-70">Date</div>
          </div>
        </div>
      </div>

      {/* Temperature Widget */}
      <div className={widgetBaseClass}>
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <div>
            <div className="text-lg font-bold">{getTemperature()}°C</div>
            <div className="text-xs opacity-70">Temp</div>
          </div>
        </div>
      </div>

      {/* Activity Widget */}
      <div className={widgetBaseClass}>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-red-400" />
          <div>
            <div className="text-sm font-bold">Active</div>
            <div className="text-xs opacity-70">Status</div>
          </div>
        </div>
      </div>

      {/* Network Widget */}
      <div className={widgetBaseClass}>
        <div className="flex items-center space-x-2">
          <Wifi className={`w-4 h-4 ${isOnline ? 'text-green-400' : 'text-red-400'}`} />
          <div>
            <div className="text-sm font-bold">{isOnline ? 'Online' : 'Offline'}</div>
            <div className="text-xs opacity-70">Network</div>
          </div>
        </div>
      </div>

      {/* Battery Widget */}
      <div className={widgetBaseClass}>
        <div className="flex items-center space-x-2">
          <Battery className={`w-4 h-4 ${
            batteryLevel !== null 
              ? batteryLevel > 20 ? 'text-green-400' : 'text-red-400'
              : 'text-gray-400'
          }`} />
          <div>
            <div className="text-sm font-bold">
              {batteryLevel !== null ? `${batteryLevel}%` : 'N/A'}
            </div>
            <div className="text-xs opacity-70">Battery</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniWidgets;