import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ConfusionMatrixProps {
  data?: number[][];
}

export function ConfusionMatrix({ data }: ConfusionMatrixProps) {
  if (!data || data.length !== 2 || data[0].length !== 2) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Confusion matrix data is unavailable.
      </div>
    );
  }

  const [tn, fp, fn, tp] = [data[0][0], data[0][1], data[1][0], data[1][1]];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead className="text-center font-semibold">Predicted: Negative</TableHead>
            <TableHead className="text-center font-semibold">Predicted: Positive</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead className="font-semibold">Actual: Negative</TableHead>
            <TableCell className="text-center bg-green-100 dark:bg-green-900/30">
              <div className="font-bold text-lg">{tn}</div>
              <div className="text-xs text-muted-foreground">True Negative</div>
            </TableCell>
            <TableCell className="text-center bg-red-100 dark:bg-red-900/30">
              <div className="font-bold text-lg">{fp}</div>
              <div className="text-xs text-muted-foreground">False Positive</div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="font-semibold">Actual: Positive</TableHead>
            <TableCell className="text-center bg-red-100 dark:bg-red-900/30">
              <div className="font-bold text-lg">{fn}</div>
              <div className="text-xs text-muted-foreground">False Negative</div>
            </TableCell>
            <TableCell className="text-center bg-green-100 dark:bg-green-900/30">
              <div className="font-bold text-lg">{tp}</div>
              <div className="text-xs text-muted-foreground">True Positive</div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
