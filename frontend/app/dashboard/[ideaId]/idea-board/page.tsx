"use client";

import { IdeaFlow } from "@/components/idea-flow";
import { useIdea } from "@/hooks/api-hooks/use-ideas";
import { useParams } from "next/navigation";

const IdeaBoardPage = () => {
  const { ideaId } = useParams<{ ideaId: string }>();
  const { data: idea, isPending, isError } = useIdea(ideaId);
  if (isPending || isError) return <>Loading...</>;

  return (
    <div className="w-full h-full absolute inset-0 z-0">
      <IdeaFlow idea={idea} />
    </div>
  );
};

export default IdeaBoardPage;
