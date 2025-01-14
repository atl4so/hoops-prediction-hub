import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface RoundResultsSectionProps {
  roundId: string;
  roundName: string;
  results: any[];
  onEdit: (result: any) => void;
}

export function RoundResultsSection({ 
  roundId, 
  roundName, 
  results, 
  onEdit 
}: RoundResultsSectionProps) {
  return (
    <AccordionItem value={roundId} className="border rounded-lg">
      <AccordionTrigger className="px-4 hover:no-underline">
        <span className="text-lg font-semibold">Round {roundName}</span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4">
        <div className="grid gap-4">
          <p className="text-muted-foreground">
            Game results functionality is being rebuilt. Please check back soon.
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}