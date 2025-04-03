
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">
          Detailed analysis of your productivity and wellness data.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Productivity Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Detailed analytics will be available here in the future.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Wellness Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Detailed analytics will be available here in the future.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
