import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ConfusionMatrixProps {
  data?: number[][];
  datasetName?: string;
}

const getDomainSpecificLabels = (datasetName?: string) => {
    switch (datasetName) {
        case 'wine-quality':
            return {
                positive: "'Good' quality",
                negative: "'Bad' quality"
            };
        case 'breast-cancer':
            return {
                positive: "'Malignant'",
                negative: "'Benign'"
            };
        case 'digits':
             return {
                positive: "the correct digit",
                negative: "not the correct digit"
            };
        default:
            return {
                positive: 'Positive',
                negative: 'Negative'
            };
    }
};


export function ConfusionMatrix({ data, datasetName }: ConfusionMatrixProps) {
  if (!data || data.length !== 2 || data[0].length !== 2) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Confusion matrix data is unavailable.
      </div>
    );
  }
  
  const labels = getDomainSpecificLabels(datasetName);
  const [tn, fp, fn, tp] = [data[0][0], data[0][1], data[1][0], data[1][1]];

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center justify-center h-full">
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]"></TableHead>
              <TableHead className="text-center font-semibold">Predicted: {labels.negative}</TableHead>
              <TableHead className="text-center font-semibold">Predicted: {labels.positive}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableHead className="font-semibold">Actual: {labels.negative}</TableHead>
              <TableCell className="text-center bg-green-100 dark:bg-green-900/30">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <div className="font-bold text-lg">{tn}</div>
                      <div className="text-xs text-muted-foreground">True Negative</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Model correctly predicted {labels.negative}.</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center bg-red-100 dark:bg-red-900/30">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <div className="font-bold text-lg">{fp}</div>
                      <div className="text-xs text-muted-foreground">False Positive</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Model incorrectly predicted {labels.positive}.</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-semibold">Actual: {labels.positive}</TableHead>
              <TableCell className="text-center bg-red-100 dark:bg-red-900/30">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <div className="font-bold text-lg">{fn}</div>
                      <div className="text-xs text-muted-foreground">False Negative</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Model incorrectly predicted {labels.negative}.</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="text-center bg-green-100 dark:bg-green-900/30">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <div className="font-bold text-lg">{tp}</div>
                      <div className="text-xs text-muted-foreground">True Positive</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Model correctly predicted {labels.positive}.</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
}

    