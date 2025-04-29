import {
  createNotepad,
  CreateNotepadPayload,
  deleteNotepad,
  getNotepad,
  getNotepads,
  NotepadResponse,
  updateNotepad,
  UpdateNotepadPayload,
} from "@/lib/api/notepads";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useNotepads = (ideaId: string) => {
  return useQuery({
    queryKey: ["notepads", ideaId],
    queryFn: () => getNotepads(ideaId),
    enabled: !!localStorage.getItem("token") && !!ideaId,
  });
};

export const useNotepad = (notepadId: string) => {
  return useQuery({
    queryKey: ["notepads", "detail", notepadId],
    queryFn: () => getNotepad(notepadId),
    enabled: !!localStorage.getItem("token") && !!notepadId,
  });
};

export const useCreateNotepad = ({
  onSuccess,
  ...options
}: UseMutationOptions<
  NotepadResponse,
  Error,
  { ideaId: string; data: CreateNotepadPayload },
  unknown
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ideaId, data }) => createNotepad(ideaId, data),
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({
        queryKey: ["notepads", variables.ideaId],
      });
      onSuccess?.(data, variables, ctx);
    },
    ...options,
  });
};

export const useUpdateNotepad = ({
  onSuccess,
  ...options
}: UseMutationOptions<
  NotepadResponse,
  Error,
  { notepadId: string; data: UpdateNotepadPayload; ideaId?: string },
  unknown
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ notepadId, data }) => updateNotepad(notepadId, data),
    onSuccess: (data, variables, ctx) => {
      if (variables.ideaId) {
        queryClient.invalidateQueries({
          queryKey: ["notepads", variables.ideaId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["notepads", "detail", variables.notepadId],
      });
      onSuccess?.(data, variables, ctx);
    },
    ...options,
  });
};

export const useDeleteNotepad = ({
  onSuccess,
  ...options
}: UseMutationOptions<
  void,
  Error,
  { notepadId: string; ideaId: string },
  unknown
> = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ notepadId }) => deleteNotepad(notepadId),
    onSuccess: (_, variables, ctx) => {
      queryClient.invalidateQueries({
        queryKey: ["notepads", variables.ideaId],
      });
      onSuccess?.(_, variables, ctx);
    },
    ...options,
  });
};
