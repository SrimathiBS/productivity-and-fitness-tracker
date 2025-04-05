
import StatsGrid from "@/components/dashboard/StatsGrid";
import ProductivityChart from "@/components/dashboard/ProductivityChart";
import AppsUsageChart from "@/components/dashboard/AppsUsageChart";
import DailyProgress from "@/components/dashboard/DailyProgress";
import MotivationCard from "@/components/dashboard/MotivationCard";
import ProductivityFitnessInsights from "@/components/dashboard/ProductivityFitnessInsights";
import { useTracking } from "@/contexts/TrackingContext";
import { useEffect } from "react";
import { checkAndResetDailyData } from "@/lib/trackingService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock } from "lucide-react";

const Dashboard = () => {
  const { isTracking, currentApp } = useTracking();
  
  useEffect(() => {
    // Check if we need to reset daily data (new day)
    checkAndResetDailyData();
  }, []);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's your productivity and fitness summary.
        </p>
      </div>
      
      {isTracking && (
        <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
          <Clock className="h-4 w-4 text-blue-500" />
          <AlertTitle>Active Tracking</AlertTitle>
          <AlertDescription>
            Currently tracking time spent on {currentApp}. Tracking will pause if you switch tabs.
          </AlertDescription>
        </Alert>
      )}
      
      <StatsGrid />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ProductivityChart />
        <DailyProgress />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AppsUsageChart />
        <div className="md:col-span-2">
          <ProductivityFitnessInsights />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
