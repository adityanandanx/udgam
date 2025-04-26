import { TIdeaNode } from "@/components/idea-flow/types";
import { Edge } from "@xyflow/react";
import axios from "../axios";

export type IdeaResponse = {
  id: string;
  user_id: string;
  title: string;
  short_desc: string;
  nodes: TIdeaNode[];
  edges: Edge[];
};

export type IdeaResponseStringified = Omit<IdeaResponse, "nodes" | "edges"> & {
  nodes: string;
  edges: string;
};

export type CreateIdeaPayload = Omit<IdeaResponse, "id" | "user_id">;

export type CreateIdeaPayloadStringified = Omit<
  CreateIdeaPayload,
  "nodes" | "edges"
> & {
  nodes: string;
  edges: string;
};

export type UpdateIdeaPayload = Partial<CreateIdeaPayload>;

export type UpdateIdeaPayloadStringified =
  Partial<CreateIdeaPayloadStringified>;

const stringifyPayload = (
  data: CreateIdeaPayload | UpdateIdeaPayload
): CreateIdeaPayloadStringified | UpdateIdeaPayloadStringified => {
  const { nodes, edges, ...rest } = data;
  return {
    ...rest,
    nodes: JSON.stringify(nodes),
    edges: JSON.stringify(edges),
  };
};

const parseResponse = (data: IdeaResponseStringified): IdeaResponse => {
  const { nodes, edges, ...rest } = data;
  return {
    ...rest,
    nodes: JSON.parse(nodes),
    edges: JSON.parse(edges),
  };
};

export const getIdeas = async (): Promise<IdeaResponse[]> => {
  const res = await axios.get<IdeaResponseStringified[]>("/ideas");
  return res.data.map((idea) => parseResponse(idea));
};

export const getIdea = async (id: string): Promise<IdeaResponse> => {
  const res = await axios.get<IdeaResponseStringified>(`/ideas/${id}`);
  return parseResponse(res.data);
};

export const createIdea = async (
  data: CreateIdeaPayload
): Promise<IdeaResponse> => {
  const res = await axios.post<IdeaResponseStringified>(
    "/ideas",
    stringifyPayload(data)
  );
  return parseResponse(res.data);
};

export const updateIdea = async (
  id: string,
  data: UpdateIdeaPayload
): Promise<IdeaResponse> => {
  const res = await axios.put<IdeaResponseStringified>(
    `/ideas/${id}`,
    stringifyPayload(data)
  );
  return parseResponse(res.data);
};

export const deleteIdea = async (id: string): Promise<void> => {
  await axios.delete(`/ideas/${id}`);
};
