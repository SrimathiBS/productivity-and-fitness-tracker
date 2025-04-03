
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { trackAppUsage, getAppUsageData, AppUsageData } from '@/lib/trackingService';

type TrackingContextType = {
  appUsageData: AppUsageData;
  isTracking: boolean;
  currentApp: string | null;
  startTracking: () => void;
  stopTracking: () => void;
  resetData: () => void;
};

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [appUsageData, setAppUsageData] = useState<AppUsageData>({});
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [currentApp, setCurrentApp] = useState<string | null>(null);

  // Initialize data from localStorage on component mount
  useEffect(() => {
    const storedData = getAppUsageData();
    if (storedData) {
      setAppUsageData(storedData);
    }
    
    // Set up visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Track when the user changes tabs or leaves the app
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      // User left the app or switched tabs
      if (isTracking) {
        stopTracking();
      }
    } else {
      // User returned to the app
      if (currentApp) {
        startTracking();
      }
    }
  };

  // Start tracking the current app
  const startTracking = () => {
    // For demo purposes, we'll simulate tracking GitHub as the current app
    const app = 'GitHub'; // This would be determined by actual URL in a real implementation
    setCurrentApp(app);
    setIsTracking(true);
    trackAppUsage(app, true);
  };

  // Stop tracking the current app
  const stopTracking = () => {
    if (currentApp) {
      trackAppUsage(currentApp, false);
      setIsTracking(false);
      
      // Update our state with the latest data
      setAppUsageData(getAppUsageData());
    }
  };

  // Reset all tracking data (for testing purposes)
  const resetData = () => {
    localStorage.removeItem('appUsageData');
    setAppUsageData({});
    setIsTracking(false);
    setCurrentApp(null);
  };

  return (
    <TrackingContext.Provider 
      value={{ 
        appUsageData,
        isTracking,
        currentApp,
        startTracking,
        stopTracking,
        resetData
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
}
