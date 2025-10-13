import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value?: string | number | null;
  baselineValue?: string | number | null;
  icon: React.ReactNode;
  isInsight?: boolean;
  isLoading?: boolean;
  cardClassName?: string;
}

export function KpiCard({ title, value, baselineValue, icon, isInsight = false, isLoading = false, cardClassName }: KpiCardProps) {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    const numericBaseline = typeof baselineValue === 'string' ? parseFloat(baselineValue) : baselineValue;

    let comparisonIndicator = null;
    if (numericValue != null && numericBaseline != null && !isInsight) {
        if (numericValue > numericBaseline) {
            comparisonIndicator = <ArrowUp className="h-4 w-4 text-green-500" />;
        } else if (numericValue < numericBaseline) {
            comparisonIndicator = <ArrowDown className="h-4 w-4 text-red-500" />;
        }
    }

  return (
    <Card className={cn(cardClassName)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className={isInsight ? 'h-16 w-full' : 'h-8 w-24'} />
        ) : isInsight ? (
          <p className="text-xs text-muted-foreground">{value || 'Not available'}</p>
        ) : (
          <div className="flex items-end gap-2">
            <div className="text-2xl font-bold">{value ?? 'N/A'}</div>
            {comparisonIndicator && (
                <div className="flex items-center text-xs text-muted-foreground">
                    {comparisonIndicator}
                    <span>vs. {baselineValue}</span>
                </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
