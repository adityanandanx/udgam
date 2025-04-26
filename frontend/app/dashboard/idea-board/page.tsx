"use client";

import CreateIdeaForm from "@/components/idea-flow/create-idea-form";

const IdeaBoardPage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1>Create a new idea</h1>
      <CreateIdeaForm />
    </div>
  );
};

export default IdeaBoardPage;
