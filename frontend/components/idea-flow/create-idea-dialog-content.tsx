import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useCreateIdea } from "@/hooks/api-hooks/use-ideas";
import { useRouter } from "next/navigation";

// Define form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  short_desc: z
    .string()
    .max(300, "Description must not exceed 300 characters")
    .min(1, "Description is required"),
  base_idea: z.string().min(1, "Base idea is required"),
});

export const CreateIdeaDialogContent = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateIdea({
    onSuccess: (data) => router.push(`/dashboard/idea-board/${data.id}`),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      short_desc: "",
      base_idea: "",
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, base_idea, short_desc } = values;
    // Add your submission logic here
    mutate({
      title,
      short_desc,
      nodes: [
        {
          data: { label: base_idea },
          type: "mindmap",
          id: "root",
          position: { x: 0, y: 0 },
        },
      ],
      edges: [],
    });
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create new idea</DialogTitle>
        <DialogDescription>
          Start your new idea with the click of a button
        </DialogDescription>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2 mt-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Idea title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="My awesome idea" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe your idea in brief</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="A robot which takes over the earth with a ..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="base_idea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base idea</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="A very intelligent robot" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="self-end" disabled={isPending}>
              Create
            </Button>
          </form>
        </Form>
      </DialogHeader>
    </DialogContent>
  );
};
