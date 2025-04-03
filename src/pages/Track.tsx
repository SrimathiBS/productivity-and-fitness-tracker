
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityTrackingForm from "@/components/tracking/ActivityTrackingForm";
import ExerciseTrackingForm from "@/components/tracking/ExerciseTrackingForm";
import AppTracker from "@/components/tracking/AppTracker";
import SmartWatchTracker from "@/components/tracking/SmartWatchTracker";

const Track = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Track Activity</h2>
        <p className="text-muted-foreground">
          Log your productivity and physical activities.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="productivity" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="productivity">Work & Productivity</TabsTrigger>
            <TabsTrigger value="exercise">Exercise & Steps</TabsTrigger>
            <TabsTrigger value="smartwatch">Smartwatch</TabsTrigger>
            <TabsTrigger value="auto-tracking">Auto Tracking</TabsTrigger>
          </TabsList>
          <TabsContent value="productivity">
            <ActivityTrackingForm />
          </TabsContent>
          <TabsContent value="exercise">
            <ExerciseTrackingForm />
          </TabsContent>
          <TabsContent value="smartwatch">
            <div className="mt-2">
              <SmartWatchTracker />
            </div>
          </TabsContent>
          <TabsContent value="auto-tracking">
            <div className="mt-2">
              <AppTracker />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Track;
