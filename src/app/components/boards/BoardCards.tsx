"use cleint";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBoards, useDeleteBoards } from "@/hooks/useBoard";
import { Board } from "@/types/board";
import BoardForm from "./BoardForm";
import { Button } from "@/components/ui/button";
import { ArrowRight, CirclePlus, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/app/shared/ConfirmDialog";
import { useRouter } from "next/navigation";

export default function BoardCards() {
  const router = useRouter();
  const { data: boards, isLoading, isError, error } = useBoards();
  const { mutate: deleteBoard } = useDeleteBoards();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null); // Prefill data state for edit
  const [selectedBoardId, setSelectedBoardId] = useState<number | null>(null); // get it for delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleAddNew = () => {
    setSelectedBoard(null); // Data khali taake naya form khule
    setIsDrawerOpen(true);
  };
  const handleEditClick = (board: Board) => {
    setSelectedBoard(board); // Row ka data save kiya
    setIsDrawerOpen(true); // Drawer khol diya (Ye auto prefill kar de ga)
  };
  const handleDeleteClick = (id: number) => {
    setSelectedBoardId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBoardId) {
      deleteBoard({ id: selectedBoardId });
      setDeleteDialogOpen(false);
      setSelectedBoardId(null);
    }
  };
  if (isLoading) {
    return <div className="text-center py-10">Loading boards...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error?.message}</div>;
  }
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">My Boards</h1>
        <div className="mb-2">
          <Button className="p-5 text-md" onClick={handleAddNew}>
            <span>
              <CirclePlus />
            </span>
            Add Board
          </Button>
        </div>
      </div>

      {boards?.length === 0 ? (
        <p className="text-gray-500">No boards found. Create one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards?.map((board: Board) => (
            <Card key={board.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {board.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`boards/${board.id}`)}
                  className="h-8 px-3 text-gray-500 hover:text-gray-700"
                >
                  Open
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-sm text-gray-600">
                  {board.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="text-xs text-gray-400 border-t pt-2 flex justify-between items-center">
                Created: {new Date(board.createdAt).toLocaleDateString()}
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(board)}
                    className="h-8 px-3 text-blue-600 hover:text-blue-800"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(board.id)}
                    className="h-8 px-3 text-blue-600 hover:text-blue-800"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <BoardForm
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        editData={selectedBoard}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Board?"
        description="Are you sure you want to delete this Board? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
}
