import {
  useCreateNotepad,
  useUpdateNotepad,
} from "@/hooks/api-hooks/use-notepads";
import { IdeaResponse } from "@/lib/api/ideas";
import { NotepadResponse } from "@/lib/api/notepads";
import CharacterCount from "@tiptap/extension-character-count";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { EditorMenus } from "./editor-menus";
import SlashCommand from "./extensions/slash-command";
import TipTapMenuBar from "./top-menu/top-menu-item";

// Define TipTap extensions
const extensions = [
  StarterKit,
  SlashCommand,
  TextAlign,
  Underline,
  CharacterCount.configure({ limit: 2000 }),
];

export const Notepad = ({
  notepad,
  idea,
}: {
  notepad?: NotepadResponse;
  idea: IdeaResponse;
}) => {
  const createNotepadMutation = useCreateNotepad({});
  const updateNotepadMutation = useUpdateNotepad({});

  const [isSaving, setIsSaving] = useState(false);
  const [editorContent, setEditorContent] = useState<string>(
    notepad?.content || "default content"
  );
  const router = useRouter();

  const handleSave = useCallback(() => {
    if (!idea) return;

    setIsSaving(true);

    // If we have a notepad ID, update it, otherwise create a new one
    if (notepad) {
      updateNotepadMutation.mutate(
        {
          notepadId: notepad.id,
          ideaId: idea.id,
          data: { content: editorContent },
        },
        {
          onSuccess: () => {
            toast.success("Notepad saved successfully");
            setIsSaving(false);
          },
          onError: (error) => {
            toast.error(`Failed to save notepad: ${error.message}`);
            setIsSaving(false);
          },
        }
      );
    } else {
      createNotepadMutation.mutate(
        {
          ideaId: idea.id,
          data: { content: editorContent },
        },
        {
          onSuccess: (data) => {
            toast.success("Notepad created successfully");
            router.push(`/dashboard/${idea.id}/notebook/${data.id}`);
            setIsSaving(false);
          },
          onError: (error) => {
            toast.error(`Failed to create notepad: ${error.message}`);
            setIsSaving(false);
          },
        }
      );
    }
  }, [
    idea,
    notepad,
    updateNotepadMutation,
    editorContent,
    createNotepadMutation,
    router,
  ]);

  // Function to handle content updates from the editor
  const handleUpdate = useCallback(({ editor }: { editor: Editor }) => {
    setEditorContent(editor.getHTML());
  }, []);

  return (
    <div className="flex flex-col mt-5">
      <div className="grid grid-cols-[1fr_auto] gap-x-2">
        {editorContent && (
          <EditorProvider
            extensions={extensions}
            autofocus
            content={editorContent}
            onUpdate={handleUpdate}
            immediatelyRender={false}
            slotAfter={
              <div className="w-fit">
                <TipTapMenuBar onSave={handleSave} />
                {isSaving && (
                  <div className="flex items-center justify-center mt-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Saving...</span>
                  </div>
                )}
              </div>
            }
            editorProps={{
              attributes: {
                class: "min-h-[768px] outline-none rounded-md w-full",
              },
              handleDOMEvents: {
                keydown: (_view, event) => {
                  // prevent default event listeners from firing when slash command is active
                  if (["ArrowUp", "ArrowDown", "Enter"].includes(event.key)) {
                    const slashCommand =
                      document.querySelector("#slash-command");
                    if (slashCommand) {
                      return true;
                    }
                  }
                },
              },
            }}
            editorContainerProps={{
              className: "prose dark:prose-invert max-w-none w-full",
            }}
          >
            <EditorMenus />
          </EditorProvider>
        )}
      </div>
    </div>
  );
};
