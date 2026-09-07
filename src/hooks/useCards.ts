"use client";
import api from "@/lib/api";
import { CardInterface, CreateCard } from "@/types/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchCards = async ({ listId }: { listId: number }): Promise<CardInterface[]> => {
  const response = await api.get(`lists/${listId}/cards`);
  return response.data;
};

export const useCards = (listId: number) => {
  return useQuery({
    queryKey: ["cards", listId],
    queryFn: () => fetchCards({ listId }),
    staleTime: 5 * 60 * 1000,
  });
};

const fetchOneCard = async ({
  cardId,
}: {
  cardId: number;
}): Promise<CardInterface> => {
  const response = await api.get(`cards/${cardId}`);
  return response.data;
};

export const useOneCard = (cardId: number) => {
  return useQuery({
    queryKey: ["card", cardId],
    queryFn: () => fetchOneCard({ cardId }),
    staleTime: 5 * 60 * 1000,
  });
};

const createCards = async ({
  listId,
  data,
}: {
  listId: number;
  data: CreateCard;
}) => {
  const response = await api.post(`lists/${listId}/cards`, data);
  return response.data;
};

export const useCreateCards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCards,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cards", variables.listId],
      });
      toast.success("Card created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create Card");
    },
  });
};

const updateCards = async ({
  listId, 
  cardId,
  data
}: {
  listId: number;  
  cardId: number;
  data:CreateCard;
}) => {
  const response = await api.patch(`cards/${cardId}`, data);
  return response.data;
};

export const useUpdateCards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCards,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cards", variables.listId],
      });
      toast.success("Card updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update Card");
    },
  });
};

const deleteCards = async ({
  cardId,
}: {
  cardId: number;
}) => {
  const response = await api.delete(`cards/${cardId}`);
  return response.data;
};

export const useDeleteCards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCards,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Card deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete Card");
    },
  });
};
