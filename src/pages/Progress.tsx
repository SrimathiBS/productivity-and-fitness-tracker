
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Progress = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Progress</h2>
        <p className="text-muted-foreground">
          Track your long-term productivity and fitness journey.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Long-term Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Progress tracking will be available here in the future.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Goals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Goals tracking will be available here in the future.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
