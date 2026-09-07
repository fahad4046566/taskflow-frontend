"use client";
import api from "@/lib/api";
import { CreateList, List } from "@/types/list";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchLists = async ({
  boardId,
}: {
  boardId: number;
}): Promise<List[]> => {
  const response = await api.get(`boards/${boardId}/lists`);
  return response.data;
};

export const useLists = (boardId: number) => {
  return useQuery({
    queryKey: ["lists", boardId],
    queryFn: () => fetchLists({ boardId }),
    staleTime: 5 * 60 * 1000,
  });
};


const fetchOneList = async ({
  boardId,
  listId,
}: {
  boardId: number;
  listId:number
}): Promise<List> => {
  const response = await api.get(`boards/${boardId}/lists/${listId}`);
  return response.data;
};

export const useOneList = (boardId: number,listId:number) => {
  return useQuery({
    queryKey: ["list", boardId,listId],
    queryFn: () => fetchOneList({ boardId,listId }),
    staleTime: 5 * 60 * 1000,
  });
};

const createLists = async ({
  boardId,
  data,
}: {
  boardId: number;
  data: CreateList;
}) => {
  const response = await api.post(`boards/${boardId}/lists`, data);
  return response.data;
};

export const useCreateLists = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLists,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["lists", variables.boardId],
      });
      toast.success("List created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create List");
    },
  });
};

const updateLists = async ({
  boardId,
  listId,
  data,
}: {
  boardId: number;
  listId: number;
  data: CreateList;
}) => {
  const response = await api.patch(`boards/${boardId}/lists/${listId}`, data);
  return response.data;
};

export const useUpdateLists = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLists,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["lists", variables.boardId],
      });
      toast.success("List updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update List");
    },
  });
};

const deleteLists = async ({
  boardId,
  listId,
}: {
  boardId: number;
  listId: number;
}) => {
  const response = await api.delete(`boards/${boardId}/lists/${listId}`);
  return response.data;
};

export const useDeleteLists = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLists,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("List deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete List");
    },
  });
};
