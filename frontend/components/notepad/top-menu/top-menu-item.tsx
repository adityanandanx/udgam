import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { useCurrentEditor } from "@tiptap/react";
import {
  Bold,
  BoldIcon,
  Code,
  Code2Icon,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  UnderlineIcon,
  Undo,
} from "lucide-react";
import { NodeSelector } from "./node-selector";

export interface TopMenuItem {
  name: string;
  font?: string | null;
  isActive: () => boolean;
  command: () => void;
  icon?: typeof BoldIcon;
}
export default function TipTapMenuBar() {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    // <div className="flex flex-wrap gap-2 items-center">
    <div className="">
      <div className="flex flex-col z-20 items-end gap-2 bg-background">
        <NodeSelector />

        <Toggle
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          variant={"outline"}
        >
          <Bold className="w-6 h-6" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          variant={"outline"}
        >
          <Italic className="w-6 h-6" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          variant={"outline"}
        >
          <UnderlineIcon className="w-6 h-6" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          variant={"outline"}
        >
          <Strikethrough className="w-6 h-6" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("code")}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          variant={"outline"}
        >
          <Code className="w-6 h-6" />
        </Toggle>

        <div className="w-9">
          <Separator decorative orientation="horizontal" />
        </div>

        <Toggle
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          variant={"outline"}
        >
          <List className="w-6 h-6" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          variant={"outline"}
        >
          <ListOrdered className="w-6 h-6" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("codeBlock")}
          onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
          variant={"outline"}
        >
          <Code2Icon className="w-6 h-6" />
        </Toggle>

        <Toggle
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          variant={"outline"}
        >
          <Quote className="w-6 h-6" />
        </Toggle>

        <Button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          variant={"outline"}
          size={"icon"}
        >
          <Undo className="w-6 h-6" />
        </Button>

        <Button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          variant={"outline"}
          size={"icon"}
        >
          <Redo className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
