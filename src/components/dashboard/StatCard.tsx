
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  gradient?: string;
  iconColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  gradient = "card-gradient", 
  iconColor = "text-blue-500"
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", gradient)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={cn("rounded-full p-2 bg-background/80 backdrop-blur-sm", iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
