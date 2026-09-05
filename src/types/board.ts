export interface Board {
  id: number;
  title: string;
  description: string;
  visibility: "private" | "public" | "workspace";
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}
export interface CreateBoard {
  title: string;
  description: string;
  visibility: string;
}
export interface BoardFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: {
    id: number;
    title: string;
    description: string;
    visibility: "private" | "public" | "workspace";
  } | null;
}