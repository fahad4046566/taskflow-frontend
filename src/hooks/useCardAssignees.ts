"use client";
import api from "@/lib/api";
import { BoardMember } from "@/types/board";
import { CardAssignee } from "@/types/card-assignee";
import { CreateCardAssignee } from "@/validations/card-assignee";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchCardAssignees = async ({
  cardId,
}: {
  cardId: number;
}): Promise<CardAssignee[]> => {
  const response = await api.get(`/cards/${cardId}/assignees`);
  return response.data;
};

export const useCardAssignees = (cardId: number) => {
  return useQuery({
    queryKey: ["cardAssignees", cardId],
    queryFn: () => fetchCardAssignees({ cardId }),
    staleTime: 5 * 60 * 1000,
  });
};

const fetchBoardMembers = async ({
  boardId,
}: {
  boardId: number;
}): Promise<BoardMember[]> => {
  const response = await api.get(`/boards/${boardId}/members`);
  return response.data;
};

export const useBoardMembers = ({ boardId }: { boardId: number }) => {
  return useQuery({
    queryKey: ["boardMembers", boardId],
    queryFn: () => fetchBoardMembers({ boardId }),
    staleTime: 5 * 60 * 1000,
  });
};

const createCardAssignee = async ({
  cardId,
  data,
}: {
  cardId: number;
  data: CreateCardAssignee;
}) => {
  const response = await api.post(`/cards/${cardId}/assignees`, data);
  return response.data;
};

export const useCreateCardAssignee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCardAssignee,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cardAssignees", variables.cardId],
      });
      toast.success("Assignee added successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to add cardAssignees",
      );
    },
  });
};

const deleteCardAssignee = async ({
  cardId,
  userId,
}: {
  cardId: number;
  userId: number;
}) => {
  const response = await api.delete(`/cards/${cardId}/assignees/${userId}`);
  return response.data;
};

export const useDeleteCardAssignee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCardAssignee,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cardAssignees", variables.cardId],
      });
      toast.success("CardAssignees deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete CardAssignees",
      );
    },
  });
};
