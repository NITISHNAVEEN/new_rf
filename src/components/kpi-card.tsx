import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface KpiCardProps {
  title: string;
  value?: string | number | null;
  icon: React.ReactNode;
  isInsight?: boolean;
  isLoading?: boolean;
}

export function KpiCard({ title, value, icon, isInsight = false, isLoading = false }: KpiCardProps) {
  return (
    <Card>
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
          <div className="text-2xl font-bold">{value ?? 'N/A'}</div>
        )}
      </CardContent>
    </Card>
  );
}
