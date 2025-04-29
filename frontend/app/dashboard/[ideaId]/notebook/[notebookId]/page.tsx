"use client";
import { Notepad } from "@/components/notepad";
import { useIdea } from "@/hooks/api-hooks/use-ideas";
import { useNotepad } from "@/hooks/api-hooks/use-notepads";
import { notFound, useParams } from "next/navigation";

const NotepadPage = () => {
  const { ideaId, notebookId } = useParams<{
    ideaId: string;
    notebookId: string;
  }>();
  const {
    data: idea,
    isPending: isIdeaPending,
    isError: isIdeaError,
  } = useIdea(ideaId);
  const notepadQuery = useNotepad(notebookId);
  const {
    data: notepad,
    isPending: isNotepadPending,
    isError: isNotepadError,
  } = notepadQuery;

  const isPending = isIdeaPending || isNotepadPending;
  const isError = isIdeaError || isNotepadError;

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error loading idea</p>;
  if (!idea || !notepad) notFound();

  return (
    <div className="mt-10 max-w-screen-xl mx-auto">
      <Notepad idea={idea} notepad={notepad} />
    </div>
  );
};

export default NotepadPage;
