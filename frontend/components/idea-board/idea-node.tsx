import React, { ReactNode } from "react";

type IdeaNodeParams = {
  text: string;
  id: number;
  children?: ReactNode;
};

const IdeaNode = ({ text, id, children }: IdeaNodeParams) => {
  return (
    <div className="bg-red-500/20 flex items-center gap-2 my-4">
      <span>
        {text} {id}
      </span>
      {children && <div className="ml-4">{children}</div>}
    </div>
  );
};

export default IdeaNode;
