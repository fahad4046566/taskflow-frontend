
 type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface CardInterface {
  id: number;
  title: string;
  description: string;
  position: number;
  dueDate?: string | null;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export type CreateCard = Omit<CardInterface, "id" | "createdAt" | "updatedAt">;

export interface CardFormProps {
  listId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: Omit<CardInterface, "createdAt" | "updatedAt"> | null;
}