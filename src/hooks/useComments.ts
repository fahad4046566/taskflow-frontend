"use client";
import api from "@/lib/api";
import { Comment } from "@/types/comment";
import { CreateComment } from "@/validations/comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchComments = async ({
  cardId,
}: {
  cardId: number;
}): Promise<Comment[]> => {
  const response = await api.get(`cards/${cardId}/comments`);
  return response.data;
};

export const useComments = (cardId: number) => {
  return useQuery({
    queryKey: ["comments", cardId],
    queryFn: () => fetchComments({ cardId }),
    staleTime: 5 * 60 * 1000,
  });
};

const createComments = async ({
  cardId,
  data,
}: {
  cardId: number;
  data: CreateComment;
}) => {
  const response = await api.post(`cards/${cardId}/comments`, data);
  return response.data;
};

export const useCreateComments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createComments,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.cardId],
      });
      toast.success("Comment added successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create Comment");
    },
  });
};

const deleteComments = async ({
  cardId,
  id,
}: {
  cardId: number;
  id: number;
}) => {
  const response = await api.delete(`comments/${id}`);
  return response.data;
};

export const useDeleteComments = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteComments,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.cardId],
      });
      toast.success("Comment deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete Comment");
    },
  });
};