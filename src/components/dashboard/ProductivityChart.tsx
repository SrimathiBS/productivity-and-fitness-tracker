
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Bar, Tooltip, CartesianGrid } from 'recharts';
import { getWeeklyData } from '@/lib/trackingService';
import { useTracking } from '@/contexts/TrackingContext';

export default function ProductivityChart() {
  const [data, setData] = useState([
    { name: 'Mon', productivity: 5.2, exercise: 30 },
    { name: 'Tue', productivity: 4.8, exercise: 45 },
    { name: 'Wed', productivity: 6.7, exercise: 60 },
    { name: 'Thu', productivity: 5.5, exercise: 25 },
    { name: 'Fri', productivity: 7.2, exercise: 50 },
    { name: 'Sat', productivity: 3.4, exercise: 90 },
    { name: 'Sun', productivity: 2.1, exercise: 70 },
  ]);
  
  const { appUsageData } = useTracking();

  useEffect(() => {
    // Update chart with actual tracking data when available
    const weeklyData = getWeeklyData();
    
    // Combine it with the exercise data that was already there
    const updatedData = weeklyData.map((day, index) => ({
      ...day,
      exercise: data[index]?.exercise || 0
    }));
    
    setData(updatedData);
  }, [appUsageData]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" className="text-xs" />
            <YAxis yAxisId="right" orientation="right" stroke="#14B8A6" className="text-xs" />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.5rem',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }} 
            />
            <Bar yAxisId="left" dataKey="productivity" name="Work Hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="exercise" name="Exercise (min)" fill="#14B8A6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
