import { useCurrentEditor } from "@tiptap/react";
import { ArrowDownAzIcon, WandSparklesIcon } from "lucide-react";
import { Button } from "../../ui/button";

const TopToolbar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;
  return (
    <div className="flex gap-2">
      <Button
        onClick={() => {
          console.log(editor);
        }}
        variant={"outline"}
      >
        <WandSparklesIcon /> AI Magic
      </Button>
      <Button variant={"outline"}>
        <ArrowDownAzIcon /> Summarize
      </Button>
    </div>
  );
};

export default TopToolbar;
