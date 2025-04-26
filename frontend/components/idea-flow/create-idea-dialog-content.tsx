import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import CreateIdeaForm from "./create-idea-form";
export const CreateIdeaDialogContent = () => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create new idea</DialogTitle>
        <DialogDescription>
          Start your new idea with the click of a button
        </DialogDescription>
        <CreateIdeaForm />
      </DialogHeader>
    </DialogContent>
  );
};
