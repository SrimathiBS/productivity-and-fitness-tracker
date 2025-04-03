
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell, Legend, Tooltip } from 'recharts';
import { getAppsUsageChartData } from '@/lib/trackingService';
import { useTracking } from '@/contexts/TrackingContext';

const COLORS = ['#3B82F6', '#4F46E5', '#0284C7', '#14B8A6', '#64748B'];

export default function AppsUsageChart() {
  const [data, setData] = useState([
    { name: 'VS Code', value: 204 },
    { name: 'GitHub', value: 132 },
    { name: 'LinkedIn', value: 56 },
    { name: 'Browser', value: 180 },
    { name: 'Other', value: 30 },
  ]);
  
  const { appUsageData } = useTracking();
  
  useEffect(() => {
    // Update chart with actual tracking data
    const updatedData = getAppsUsageChartData();
    if (updatedData && updatedData.length > 0) {
      setData(updatedData);
    }
  }, [appUsageData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apps Usage</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} mins`, 'Time Spent']}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.5rem',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
