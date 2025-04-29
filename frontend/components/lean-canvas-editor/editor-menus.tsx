import { FloatingMenu, useCurrentEditor } from "@tiptap/react";

// Custom menus with proper editor instance
export const EditorMenus = () => {
  const { editor } = useCurrentEditor();

  if (!editor) return null;

  return (
    <>
      <FloatingMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="opacity-25"
      >
        <span>Press / to open menu</span>
      </FloatingMenu>
    </>
  );
};
