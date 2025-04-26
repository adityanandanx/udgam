import { Panel } from "@xyflow/react";
import React from "react";
import useStore from "./store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useIdeas } from "@/hooks/api-hooks/use-ideas";

const DebugPanel = () => {
  const nodes = useStore((state) => state.nodes);

  const { data } = useIdeas();
  return (
    <Panel
      position="top-right"
      className="overflow-y-scroll max-h-[80vh] w-md bg-background/80 rounded-md p-4 text-xs border"
    >
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Zustand state (Client)</AccordionTrigger>
          <AccordionContent>
            <pre>{JSON.stringify(nodes, null, 2)}</pre>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>React query state (Server)</AccordionTrigger>
          <AccordionContent>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Panel>
  );
};

export default DebugPanel;
