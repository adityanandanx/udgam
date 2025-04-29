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
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
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
  const [notepadTitle, setNotepadTitle] = useState<string>(
    notepad?.title || `${idea.title} Notes`
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
          data: {
            title: notepadTitle,
            content: editorContent,
          },
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
          data: {
            title: notepadTitle,
            content: editorContent,
          },
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
    notepadTitle,
    createNotepadMutation,
    router,
  ]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotepadTitle(e.target.value);
  };

  // Function to handle content updates from the editor
  const handleUpdate = useCallback(({ editor }: { editor: Editor }) => {
    setEditorContent(editor.getHTML());
  }, []);

  return (
    <div className="flex flex-col mt-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1 mr-4">
          <input
            value={notepadTitle}
            onChange={handleTitleChange}
            placeholder="Notepad Title"
            className="text-lg h-9 border-none outline-none w-full"
          />
        </div>
        <Button
          variant={"outline"}
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save</span>
            </>
          )}
        </Button>
      </div>

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
                <TipTapMenuBar />
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
