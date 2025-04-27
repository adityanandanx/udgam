import {
  createIdea,
  CreateIdeaPayload,
  deleteIdea,
  getIdea,
  getIdeas,
  getIdeaValidation,
  IdeaResponse,
  updateIdea,
  UpdateIdeaPayload,
} from "@/lib/api/ideas";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useIdeas = () => {
  return useQuery({
    queryKey: ["ideas"],
    queryFn: getIdeas,
    enabled: !!localStorage.getItem("token"),
  });
};

export const useIdea = (id: string) => {
  return useQuery({
    queryKey: ["ideas", id],
    queryFn: async () => {
      const idea = await getIdea(id);
      return idea;
    },
    enabled: !!localStorage.getItem("token"),
  });
};

export const useCreateIdea = ({
  onSuccess,
  ...options
}: UseMutationOptions<
  IdeaResponse,
  Error,
  CreateIdeaPayload,
  unknown
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIdea,
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      onSuccess?.(data, variables, ctx);
    },
    ...options,
  });
};

export const useUpdateIdea = ({
  onSuccess,
  ...options
}: UseMutationOptions<
  IdeaResponse,
  Error,
  { id: string; data: UpdateIdeaPayload },
  unknown
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateIdea(id, data),
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
      queryClient.invalidateQueries({ queryKey: ["ideas", variables.id] });
      onSuccess?.(data, variables, ctx);
    },
    ...options,
  });
};

export const useDeleteIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
};

export const useValidationOfIdea = (ideaId: string) => {
  return useQuery({
    queryKey: ["ideas", ideaId, "validation"],
    queryFn: async () => {
      const validation = await getIdeaValidation(ideaId);
      return validation;
    },
    enabled: !!localStorage.getItem("token"),
  });
};
