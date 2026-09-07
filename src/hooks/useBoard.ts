"use client";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";
import { Board, CreateBoard } from "@/types/board";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchBoards = async (): Promise<Board[]> => {
  const response = await api.get("/boards/all");
  return response.data;
};

export const useBoards = () => {
  const { token, isLoading: authLoading } = useAuth();
  const { data, isLoading, isError, error } = useQuery<Board[]>({
    queryKey: ["boards"],
    queryFn: fetchBoards,
    staleTime: 5 * 60 * 1000,
    enabled: !!token && !authLoading,
  });
  return { data, isLoading, isError, error };
};

const createBoards = async (data: CreateBoard) => {
  const response = await api.post("/boards/create", data);
  return response.data;
};

export const useCreateBoards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBoards,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      toast.success("Board created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create board");
    },
  });
};

const updateBoards = async ({
  id,
  data,
}: {
  id: number;
  data: CreateBoard;
}) => {
  const response = await api.patch(`/boards/${id}`, data);
  return response.data;
};

export const useUpdateBoards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBoards,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      toast.success("Board updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update board");
    },
  });
};

const deleteBoards = async ({ id }: { id: number }) => {
  const response = await api.delete(`/boards/${id}`);
  return response.data;
};

export const useDeleteBoards = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBoards,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      toast.success("Board deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete board");
    },
  });
};