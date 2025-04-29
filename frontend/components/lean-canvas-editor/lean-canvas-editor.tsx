import { useIdea } from "@/hooks/api-hooks/use-ideas";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useParams } from "next/navigation";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import CharacterCount from "@tiptap/extension-character-count";
import SlashCommand from "./extensions/slash-command";
import TipTapMenuBar from "./top-menu/top-menu-item";
import { EditorMenus } from "./editor-menus";

// Define TipTap extensions
const extensions = [
  StarterKit,
  SlashCommand,
  TextAlign,
  Underline,
  CharacterCount.configure({ limit: 2000 }),
];

export const LeanCanvasEditor = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const { data: idea, isPending } = useIdea(ideaId);

  if (isPending) return <div>Loading...</div>;

  return (
    <div className="flex flex-col mt-5">
      <div className="grid grid-cols-[1fr_auto] gap-x-2">
        <EditorProvider
          extensions={extensions}
          autofocus
          content={`<h1>${idea?.title}</h1>`}
          immediatelyRender={false}
          editorContainerProps={{
            className: "prose dark:prose-invert max-w-none w-full",
          }}
          editorProps={{
            attributes: {
              class: "min-h-[768px] outline-none rounded-md w-full",
            },
            handleDOMEvents: {
              keydown: (_view, event) => {
                // prevent default event listeners from firing when slash command is active
                if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
                  const slashCommand = document.querySelector("#slash-command");
                  if (slashCommand) {
                    return true;
                  }
                }
              },
            },
          }}
          slotAfter={
            <div className="w-fit">
              <TipTapMenuBar />
            </div>
          }
        >
          <EditorMenus />
        </EditorProvider>
      </div>
    </div>
  );
};
