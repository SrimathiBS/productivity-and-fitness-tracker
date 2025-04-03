
import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { Clock, Code, Linkedin, Github, Activity, Flame } from "lucide-react";
import { getTotalTimeToday } from "@/lib/trackingService";
import { getFitnessData } from "@/lib/bluetoothService";

export default function StatsGrid() {
  const [productivityTime, setProductivityTime] = useState<string>("0h 0m");
  const [fitnessData, setFitnessData] = useState(getFitnessData());
  
  // Update stats every 30 seconds
  useEffect(() => {
    function updateStats() {
      // Get productivity time
      const totalMinutes = getTotalTimeToday();
      const hours = Math.floor(totalMinutes / 60);
      const minutes = Math.round(totalMinutes % 60);
      setProductivityTime(`${hours}h ${minutes}m`);
      
      // Get fitness data
      setFitnessData(getFitnessData());
    }
    
    // Update stats immediately
    updateStats();
    
    // Then update every 30 seconds
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Calculate step goal percentage
  const stepGoalPercent = Math.min(100, Math.round((fitnessData.stepCount / 10000) * 100));
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <StatCard 
        title="Total Work Time" 
        value={productivityTime} 
        icon={Clock}
        description="Today's productivity"
        gradient="card-gradient"
      />
      <StatCard 
        title="VS Code" 
        value="3h 24m" 
        icon={Code}
        description="Your most used app"
        gradient="card-gradient"
        iconColor="text-teal-500"
      />
      <StatCard 
        title="LinkedIn" 
        value="56m" 
        icon={Linkedin}
        description="Networking time"
        gradient="card-gradient"
        iconColor="text-blue-700"
      />
      <StatCard 
        title="GitHub" 
        value="2h 12m" 
        icon={Github}
        description="Coding today"
        gradient="card-gradient-2"
        iconColor="text-indigo-600"
      />
      <StatCard 
        title="Steps" 
        value={fitnessData.stepCount.toLocaleString()} 
        icon={Activity}
        description={`${stepGoalPercent}% of daily goal`}
        gradient="card-gradient-2"
        iconColor="text-blue-500"
      />
      <StatCard 
        title="Calories" 
        value={fitnessData.caloriesBurned || "0"} 
        icon={Flame}
        description="Burned today"
        gradient="card-gradient-2"
        iconColor="text-orange-500"
      />
    </div>
  );
}
