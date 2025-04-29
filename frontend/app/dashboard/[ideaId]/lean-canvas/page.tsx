"use client";
import { LeanCanvasEditor } from "@/components/lean-canvas-editor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircleIcon } from "lucide-react";

const LeanCanvasPage = () => {
  return (
    <div className="mt-10 max-w-screen-xl mx-auto">
      <div className="flex justify-end items-center gap-2">
        <HelpDialog />
      </div>
      <div>
        <LeanCanvasEditor />
      </div>
    </div>
  );
};

const HelpDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="text-muted-foreground"
          variant={"ghost"}
          size={"icon"}
        >
          <HelpCircleIcon className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What is Lean Canvas?</DialogTitle>
          <DialogDescription>
            Lean Canvas is a 1-page business plan template that helps you
            deconstruct your idea into its key assumptions. It&apos;s adapted
            from the Business Model Canvas and optimized for Lean Startups.
            <br />A Lean Canvas replaces long and boring business plans with a
            1-page Business Model that takes 20 minutes to create, and that gets
            read.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <a
            target="_blank"
            rel="noopener,noreferrer"
            href="https://www.leanfoundry.com/articles/what-is-lean-canvas"
          >
            <Button variant={"secondary"}>Learn More</Button>
          </a>
          <DialogClose asChild>
            <Button variant={"ghost"}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeanCanvasPage;
