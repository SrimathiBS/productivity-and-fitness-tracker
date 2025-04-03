
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressItemProps {
  label: string;
  current: number;
  max: number;
  color: string;
}

function ProgressItem({ label, current, max, color }: ProgressItemProps) {
  const percentage = Math.min(100, Math.round((current / max) * 100));
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{percentage}%</span>
      </div>
      <Progress value={percentage} className={color} />
    </div>
  );
}

export default function DailyProgress() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Daily Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <ProgressItem 
          label="Productivity Score" 
          current={75} 
          max={100}
          color="bg-blue-500" 
        />
        <ProgressItem 
          label="Work Focus" 
          current={85} 
          max={100}
          color="bg-indigo-500" 
        />
        <ProgressItem 
          label="Step Goal" 
          current={6432} 
          max={10000}
          color="bg-teal-500" 
        />
        <ProgressItem 
          label="Water Intake" 
          current={5} 
          max={8}
          color="bg-sky-500" 
        />
      </CardContent>
    </Card>
  );
}
