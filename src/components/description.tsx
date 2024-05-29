import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type DescriptionProps = {
  title: string;
};

export function Description({ title }: DescriptionProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info size={14} className="text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent className="mb-1 dark:bg-[#171717]">
          {title}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
