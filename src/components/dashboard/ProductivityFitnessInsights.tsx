
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Flame, ArrowUp, ArrowDown } from "lucide-react";
import { useTracking } from '@/contexts/TrackingContext';
import { getFitnessData } from '@/lib/bluetoothService';
import { getTotalTimeToday } from '@/lib/trackingService';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductivityFitnessInsights() {
  const [insights, setInsights] = useState<string>('');
  const [insightType, setInsightType] = useState<'balance' | 'workout' | 'productivity'>('balance');
  const { appUsageData } = useTracking();
  const [fitnessData, setFitnessData] = useState(getFitnessData());
  
  useEffect(() => {
    // Update fitness data every 10 seconds
    const interval = setInterval(() => {
      setFitnessData(getFitnessData());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Generate insights based on productivity and fitness data
    const totalProductivityMinutes = getTotalTimeToday();
    const stepCount = fitnessData.stepCount;
    
    // Convert productivity time to hours for better readability
    const productivityHours = Math.round(totalProductivityMinutes / 6) / 10; // Round to 1 decimal place
    
    if (productivityHours > 3 && stepCount < 3000) {
      setInsights(`You've worked for ${productivityHours} hours but only taken ${stepCount.toLocaleString()} steps. Consider taking a short walk!`);
      setInsightType('workout');
    } else if (productivityHours < 1 && stepCount > 8000) {
      setInsights(`Great job on your ${stepCount.toLocaleString()} steps today! Consider balancing with some focused work time.`);
      setInsightType('productivity');
    } else if (productivityHours > 2 && stepCount > 5000) {
      setInsights(`Excellent balance! You've worked for ${productivityHours} hours and taken ${stepCount.toLocaleString()} steps. Keep it up! 🔥`);
      setInsightType('balance');
    } else if (productivityHours > 4) {
      setInsights(`You've been working for ${productivityHours} hours. Remember to take short breaks and move around!`);
      setInsightType('workout');
    } else if (stepCount > 10000) {
      setInsights(`Impressive! You've taken ${stepCount.toLocaleString()} steps today. That's great for your health! 💪`);
      setInsightType('balance');
    } else {
      setInsights(`Try to balance your day with both productive work and regular movement.`);
      setInsightType('balance');
    }
  }, [appUsageData, fitnessData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productivity & Fitness Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert 
          className={
            insightType === 'balance' ? 'bg-blue-50 border-blue-200' :
            insightType === 'workout' ? 'bg-orange-50 border-orange-200' :
            'bg-green-50 border-green-200'
          }
        >
          {insightType === 'balance' && <Flame className="h-4 w-4 text-blue-500" />}
          {insightType === 'workout' && <ArrowUp className="h-4 w-4 text-orange-500" />}
          {insightType === 'productivity' && <ArrowDown className="h-4 w-4 text-green-500" />}
          
          <AlertTitle className={
            insightType === 'balance' ? 'text-blue-700' :
            insightType === 'workout' ? 'text-orange-700' :
            'text-green-700'
          }>
            {
              insightType === 'balance' ? 'Balanced Lifestyle' :
              insightType === 'workout' ? 'Time to Move' :
              'Productivity Focus'
            }
          </AlertTitle>
          <AlertDescription className={
            insightType === 'balance' ? 'text-blue-600' :
            insightType === 'workout' ? 'text-orange-600' :
            'text-green-600'
          }>
            {insights}
          </AlertDescription>
        </Alert>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-md bg-gray-50 p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">Productivity</div>
            <div className="text-2xl font-bold">{Math.round(getTotalTimeToday() / 6) / 10}h</div>
          </div>
          <div className="rounded-md bg-gray-50 p-4 text-center">
            <div className="text-sm text-gray-500 mb-1">Fitness</div>
            <div className="text-2xl font-bold">{Math.round(fitnessData.stepCount / 1000)}k</div>
            <div className="text-xs text-gray-500">steps</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
