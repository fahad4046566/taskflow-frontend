import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCards, useDeleteCards } from "@/hooks/useCards";
import { CardInterface } from "@/types/card";
import { CirclePlus, MoreHorizontalIcon, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import CardForm from "./CardForm";
import { ConfirmDialog } from "@/app/shared/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Cards = ({ listId }: { listId: number }) => {
  const { data: cards, isLoading, isError, error } = useCards(listId);
  const { mutate: deleteCard } = useDeleteCards();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardInterface | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleAddNew = () => {
    setSelectedCard(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (card: CardInterface) => {
    setSelectedCard(card);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedCardId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCardId !== null) {
      deleteCard({ cardId: selectedCardId });
      setDeleteDialogOpen(false);
      setSelectedCardId(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading Cards...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error?.message}</div>;
  }

  return (
    <>
      <Card>
        {cards?.length === 0 ? (
          <p className="text-gray-500 text-center">
            No cards found. Create one!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {cards?.map((card: CardInterface) => (
              <Card key={card.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {card.title}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" />}>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(card)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDeleteClick(card.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-sm text-gray-600">
                    {card.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="text-xs text-gray-400 border-t pt-2 flex justify-between items-center">
                  Created: {new Date(card.createdAt).toLocaleDateString()}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        <CardFooter>
          <Button className="w-full" variant="outline" onClick={handleAddNew}>
            <CirclePlus className="h-5 w-5 mr-2" />
            Add a card
          </Button>
        </CardFooter>
      </Card>
      <CardForm
        listId={listId}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        editData={selectedCard}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Card?"
        description="Are you sure you want to delete this Card? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </>
  );
};

export default Cards;
