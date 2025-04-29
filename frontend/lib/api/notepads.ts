import axios from "../axios";

export type NotepadResponse = {
  id: string;
  idea_id: string;
  user_id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateNotepadPayload = {
  title?: string;
  content: string;
};

export type UpdateNotepadPayload = {
  title?: string;
  content: string;
};

export const getNotepads = async (
  ideaId: string
): Promise<NotepadResponse[]> => {
  const res = await axios.get<NotepadResponse[]>(`/ideas/${ideaId}/notepads`);
  return res.data;
};

export const getNotepad = async (
  notepadId: string
): Promise<NotepadResponse> => {
  const res = await axios.get<NotepadResponse>(`/notepads/${notepadId}`);
  return res.data;
};

export const createNotepad = async (
  ideaId: string,
  data: CreateNotepadPayload
): Promise<NotepadResponse> => {
  const res = await axios.post<NotepadResponse>(
    `/ideas/${ideaId}/notepads`,
    data
  );
  return res.data;
};

export const updateNotepad = async (
  notepadId: string,
  data: UpdateNotepadPayload
): Promise<NotepadResponse> => {
  const res = await axios.put<NotepadResponse>(`/notepads/${notepadId}`, data);
  return res.data;
};

export const deleteNotepad = async (notepadId: string): Promise<void> => {
  await axios.delete(`/notepads/${notepadId}`);
};
