export interface List {
  id: number;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}
export interface CreateList {
  title: string;
  position: number;
}
export interface ListFormProps {
  boardId:number;  
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editData?: {
    id: number;
    title: string;
    position: number;
  } | null;
}
