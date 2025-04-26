import {
  createIdea,
  CreateIdeaPayload,
  getIdea,
  getIdeas,
  IdeaResponse,
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

export const useUpdateIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
};

export const useDeleteIdea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas"] });
    },
  });
};
