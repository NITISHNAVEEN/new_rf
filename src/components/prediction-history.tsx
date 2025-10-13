import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Prediction } from "@/lib/types";
import { Badge } from "./ui/badge";

interface PredictionHistoryProps {
  history: Prediction[];
}

export function PredictionHistory({ history }: PredictionHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        No prediction history available. Train a model to see results.
      </div>
    );
  }

  const featureKeys = Object.keys(history[0]?.features || {});
  const displayedFeatures = featureKeys.slice(0, 4);

  return (
    <ScrollArea className="h-72 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            {displayedFeatures.map((key) => (
              <TableHead key={key}>{key}</TableHead>
            ))}
            <TableHead className="text-right">Actual</TableHead>
            <TableHead className="text-right">Predicted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(p.date).toLocaleString()}
              </TableCell>
              {displayedFeatures.map((key) => (
                <TableCell key={key}>{p.features[key]}</TableCell>
              ))}
              <TableCell className="text-right">
                <Badge variant="secondary">{p.actual}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Badge>{p.prediction}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
