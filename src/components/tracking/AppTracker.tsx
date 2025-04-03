
import { useState } from 'react';
import { useTracking } from '@/contexts/TrackingContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function AppTracker() {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const { isTracking, currentApp, startTracking, stopTracking, resetData } = useTracking();
  const { toast } = useToast();
  
  const handleAppSelection = (app: string) => {
    setSelectedApp(app);
  };
  
  const handleStartTracking = () => {
    if (!selectedApp) {
      toast({
        title: "No app selected",
        description: "Please select an app to track",
        variant: "destructive"
      });
      return;
    }
    
    startTracking();
    toast({
      title: "Tracking started",
      description: `Now tracking usage of ${selectedApp}`,
    });
  };
  
  const handleStopTracking = () => {
    stopTracking();
    toast({
      title: "Tracking stopped",
      description: `Tracked time has been saved`,
    });
    setSelectedApp(null);
  };
  
  const handleResetData = () => {
    resetData();
    toast({
      title: "Data reset",
      description: "All tracking data has been cleared",
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" /> 
          App Usage Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          <p>Select an app and start tracking to automatically record your time spent.</p>
          <p className="mt-2">The timer will pause when you switch tabs or leave the browser.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 mb-6">
          <Button
            variant={selectedApp === 'GitHub' ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => handleAppSelection('GitHub')}
            disabled={isTracking}
          >
            <Github className="h-4 w-4" />
            GitHub
          </Button>
          
          <Button
            variant={selectedApp === 'LinkedIn' ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => handleAppSelection('LinkedIn')}
            disabled={isTracking}
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </Button>
        </div>
        
        <div className="mt-4">
          {isTracking ? (
            <div className="text-sm mb-4">
              Currently tracking: <span className="font-medium">{currentApp}</span>
              <div className="animate-pulse mt-2">
                <div className="h-2 bg-blue-500 rounded"></div>
              </div>
            </div>
          ) : selectedApp ? (
            <div className="text-sm mb-4">
              Ready to track: <span className="font-medium">{selectedApp}</span>
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button 
            className="flex-1" 
            onClick={handleStartTracking} 
            disabled={isTracking || !selectedApp}
          >
            Start Tracking
          </Button>
          <Button 
            variant="destructive"
            className="flex-1" 
            onClick={handleStopTracking} 
            disabled={!isTracking}
          >
            Stop Tracking
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs" 
          onClick={handleResetData}
        >
          Reset All Data
        </Button>
      </CardFooter>
    </Card>
  );
}
