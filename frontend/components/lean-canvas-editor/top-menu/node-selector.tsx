import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCurrentEditor } from "@tiptap/react";
import {
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
} from "lucide-react";
import { FC } from "react";
import DynamicHeadingIcon from "./dynamic-heading-icon";
import { TopMenuItem } from "./top-menu-item";

export const NodeSelector: FC = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;
  const items: TopMenuItem[] = [
    {
      name: "Heading 1",
      icon: Heading1,
      command: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      name: "Heading 2",
      icon: Heading2,
      command: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      name: "Heading 3",
      icon: Heading3,
      command: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      name: "Heading 4",
      icon: Heading4,
      command: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: () => editor.isActive("heading", { level: 4 }),
    },
    {
      name: "Heading 5",
      icon: Heading5,
      command: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: () => editor.isActive("heading", { level: 5 }),
    },
    {
      name: "Heading 6",
      icon: Heading6,
      command: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: () => editor.isActive("heading", { level: 6 }),
    },
  ];

  const activeItem = items.filter((item) => item.isActive()).pop() ?? {
    name: "Font",
  };

  return (
    <Popover>
      <div className="relative h-full">
        <PopoverTrigger
          // className="flex h-full items-center gap-1 whitespace-nowrap p-2.5 text-base text-black bg-[#f1f5f9] active:bg-stone-200 rounded-md font-semibold"
          asChild
        >
          <Button variant={"outline"}>
            <span className="">
              <DynamicHeadingIcon name={activeItem.name} />
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="center"
          className="z-[99999] my-1 flex max-h-80 w-auto flex-row overflow-hidden overflow-y-auto rounded border border-stone-200 bg-white p-1 shadow-xl animate-in fade-in slide-in-from-top-1"
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.command();
              }}
              className={`${
                activeItem.name === item.name && "bg-slate-400"
              } flex items-center justify-between rounded-sm px-2 py-1 text-sm text-stone-600 hover:bg-slate-200`}
              type="button"
            >
              <div className="flex items-center space-x-2">
                {item.icon && <item.icon className="h-6 w-6" />}
              </div>
            </button>
          ))}
        </PopoverContent>
      </div>
    </Popover>
  );
};
