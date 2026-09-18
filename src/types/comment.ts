export interface Comment {
  id: number;
  content:string
  createdAt: string;
  updatedAt: string;
}

export interface CommentFormProps {
  cardId:number;  
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
