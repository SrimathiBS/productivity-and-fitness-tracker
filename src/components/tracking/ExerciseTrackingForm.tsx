
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { getFitnessData } from "@/lib/bluetoothService";

export default function ExerciseTrackingForm() {
  const [exerciseType, setExerciseType] = useState("");
  const [duration, setDuration] = useState("");
  const [steps, setSteps] = useState("");
  const [calories, setCalories] = useState("");
  const [smartwatchData, setSmartWatchData] = useState(getFitnessData());

  const DAILY_STEP_GOAL = 10000;

  // Update with smartwatch data if available
  useEffect(() => {
    // Check for smartwatch data every 10 seconds
    const interval = setInterval(() => {
      const fitnessData = getFitnessData();
      setSmartWatchData(fitnessData);
      
      // Auto-populate steps field if smartwatch data is available and user hasn't manually entered anything
      if (fitnessData.stepCount > 0 && !steps) {
        setSteps(fitnessData.stepCount.toString());
      }
      
      // Auto-populate calories field if smartwatch data is available and user hasn't manually entered anything
      if (fitnessData.caloriesBurned && !calories) {
        setCalories(fitnessData.caloriesBurned.toString());
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [steps, calories]);

  const handleExerciseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exerciseType || !duration) {
      toast.error("Please fill out exercise type and duration");
      return;
    }

    // Save to localStorage (in a real app, would send to backend)
    const exercises = JSON.parse(localStorage.getItem("exerciseActivities") || "[]");
    exercises.push({
      type: exerciseType,
      duration: parseInt(duration),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("exerciseActivities", JSON.stringify(exercises));
    
    // Clear form
    setExerciseType("");
    setDuration("");
    
    toast.success(`${exerciseType} exercise logged: ${duration} minutes`);
  };

  const handleStepsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!steps) {
      toast.error("Please enter your step count");
      return;
    }

    // Save to localStorage (in a real app, would send to backend)
    const stepsData = JSON.parse(localStorage.getItem("stepsData") || "[]");
    stepsData.push({
      steps: parseInt(steps),
      calories: calories ? parseInt(calories) : Math.round(parseInt(steps) * 0.04),
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("stepsData", JSON.stringify(stepsData));
    
    // Clear form
    setSteps("");
    setCalories("");
    
    toast.success(`Steps logged: ${steps}`);
  };

  // Calculate current step progress
  const currentSteps = parseInt(steps) || smartwatchData.stepCount || 0;
  const stepProgress = Math.min(100, Math.round((currentSteps / DAILY_STEP_GOAL) * 100));

  // Check if we have smartwatch data
  const hasSmartWatchData = smartwatchData.stepCount > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Exercise</CardTitle>
        <CardDescription>Log your physical activities and progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Log a Workout</h3>
            <form onSubmit={handleExerciseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="exerciseType">Exercise Type</Label>
                  <Select
                    value={exerciseType}
                    onValueChange={setExerciseType}
                  >
                    <SelectTrigger id="exerciseType">
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Running">Running</SelectItem>
                      <SelectItem value="Walking">Walking</SelectItem>
                      <SelectItem value="Cycling">Cycling</SelectItem>
                      <SelectItem value="Swimming">Swimming</SelectItem>
                      <SelectItem value="Yoga">Yoga</SelectItem>
                      <SelectItem value="Strength Training">Strength Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input 
                    id="duration"
                    type="number"
                    placeholder="e.g., 30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Log Exercise</Button>
            </form>
          </div>
          
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-sm font-medium">Track Steps</h3>
            
            {hasSmartWatchData && (
              <div className="rounded-md bg-blue-50 p-3 mb-4 text-sm text-blue-700 border border-blue-200">
                <p>Smartwatch connected! Step data is being automatically updated.</p>
              </div>
            )}
            
            <form onSubmit={handleStepsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="steps">Step Count</Label>
                  <Input 
                    id="steps"
                    type="number"
                    placeholder={hasSmartWatchData ? smartwatchData.stepCount.toString() : "e.g., 8000"}
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories Burned (optional)</Label>
                  <Input 
                    id="calories"
                    type="number"
                    placeholder={hasSmartWatchData && smartwatchData.caloriesBurned ? 
                      smartwatchData.caloriesBurned.toString() : "e.g., 320"}
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to daily goal (10,000 steps)</span>
                  <span>{stepProgress}%</span>
                </div>
                <Progress value={stepProgress} className="h-2" />
              </div>
              
              <Button type="submit" className="w-full">Log Steps</Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
