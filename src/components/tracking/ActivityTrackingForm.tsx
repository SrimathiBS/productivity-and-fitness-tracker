
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Timer } from "lucide-react";

export default function ActivityTrackingForm() {
  const [activityType, setActivityType] = useState("");
  const [minutes, setMinutes] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activityType || !minutes) {
      toast.error("Please fill out all fields");
      return;
    }

    // Save to localStorage (in a real app, would send to backend)
    const activities = JSON.parse(localStorage.getItem("productivityActivities") || "[]");
    activities.push({
      type: activityType,
      minutes: parseInt(minutes),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("productivityActivities", JSON.stringify(activities));
    
    // Clear form
    setActivityType("");
    setMinutes("");
    
    toast.success(`${activityType} activity logged: ${minutes} minutes`);
  };

  const startTracking = () => {
    if (!activityType) {
      toast.error("Please select an activity type");
      return;
    }
    
    setIsTracking(true);
    const now = new Date();
    setStartTime(now);
    
    const interval = window.setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  const stopTracking = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    setIsTracking(false);
    
    if (startTime) {
      const endTime = new Date();
      const durationInMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
      
      // Save to localStorage
      const activities = JSON.parse(localStorage.getItem("productivityActivities") || "[]");
      activities.push({
        type: activityType,
        minutes: durationInMinutes,
        timestamp: startTime.toISOString(),
        endTimestamp: endTime.toISOString()
      });
      localStorage.setItem("productivityActivities", JSON.stringify(activities));
      
      toast.success(`${activityType} activity logged: ${durationInMinutes} minutes`);
      
      // Reset
      setActivityType("");
      setStartTime(null);
      setElapsedTime(0);
    }
  };

  const formatElapsedTime = () => {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Productivity</CardTitle>
        <CardDescription>Log your work activities or track them in real-time</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleActivitySubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="activityType">Activity Type</Label>
            <Select
              value={activityType}
              onValueChange={setActivityType}
              disabled={isTracking}
            >
              <SelectTrigger id="activityType">
                <SelectValue placeholder="Select an activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GitHub">GitHub</SelectItem>
                <SelectItem value="VS Code">VS Code</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Meetings">Meetings</SelectItem>
                <SelectItem value="Learning">Learning</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!isTracking ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="minutes">Minutes Spent</Label>
                <Input 
                  id="minutes"
                  type="number"
                  placeholder="Enter minutes"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">Log Manually</Button>
                <Button 
                  type="button" 
                  onClick={startTracking}
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
                >
                  <Timer className="h-4 w-4" /> Start Timer
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-muted flex flex-col items-center justify-center">
                <div className="text-sm text-muted-foreground mb-2">Currently tracking: {activityType}</div>
                <div className="text-3xl font-mono">{formatElapsedTime()}</div>
              </div>
              
              <Button 
                type="button" 
                onClick={stopTracking}
                variant="destructive"
                className="w-full"
              >
                Stop Tracking
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
