export interface CardAssignee {
  id: number;
  cardId: number;
  userId: number;
  assignedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}


export interface CardAssigneeFormProps {
  cardId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}