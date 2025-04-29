"use client";
import { Notepad } from "@/components/notepad";
import { useIdea } from "@/hooks/api-hooks/use-ideas";
import { notFound, useParams } from "next/navigation";

const CreateNotepadPage = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const { data: idea, isPending, isError } = useIdea(ideaId);
  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error loading idea</p>;
  if (!idea) notFound();

  return (
    <div className="mt-10 max-w-screen-xl mx-auto">
      <Notepad idea={idea} />
    </div>
  );
};

export default CreateNotepadPage;
