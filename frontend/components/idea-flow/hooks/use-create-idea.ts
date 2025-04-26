import { useCreateIdea } from "@/hooks/api-hooks/use-ideas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define form schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  short_desc: z
    .string()
    .max(300, "Description must not exceed 300 characters")
    .min(1, "Description is required"),
  base_idea: z.string().min(1, "Base idea is required"),
});

export type CreateIdeaFormValues = z.infer<typeof formSchema>;

export function useCreateIdeaForm() {
  const router = useRouter();
  const { mutate, isPending } = useCreateIdea({
    onSuccess: (data) => router.push(`/dashboard/${data.id}/idea-board`),
  });

  // Initialize form
  const form = useForm<CreateIdeaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      short_desc: "",
      base_idea: "",
    },
  });

  // Handle form submission
  function onSubmit(values: CreateIdeaFormValues) {
    const { title, base_idea, short_desc } = values;
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

  return {
    form,
    onSubmit,
    isPending,
  };
}
