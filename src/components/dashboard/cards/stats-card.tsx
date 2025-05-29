import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string;
  value?: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  className 
}: Readonly<StatsCardProps>) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value || 0}</h3>
            
            {trend && (
              <div className="flex items-center mt-1">
                <span 
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                </span>
                {description && (
                  <span className="text-xs text-muted-foreground ml-1">
                    {description}
                  </span>
                )}
              </div>
            )}
            
            {!trend && description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          
          <div className="p-2 rounded-md bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
