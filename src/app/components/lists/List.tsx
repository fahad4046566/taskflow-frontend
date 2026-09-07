"use client";

import { Button } from "@/components/ui/button";
import { useDeleteLists, useLists } from "@/hooks/useLists";
import type { List } from "@/types/list";
import { CirclePlus, MoreHorizontalIcon, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import ListForm from "./ListForm";
import { ConfirmDialog } from "@/app/shared/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Cards from "../cards/Cards";

const List = ({ boardId }: { boardId: number }) => {
  const { data: lists, isLoading, isError, error } = useLists(boardId);
  const { mutate: deleteList } = useDeleteLists();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleAddNew = () => {
    setSelectedList(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (list: List) => {
    setSelectedList(list);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedListId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedListId !== null) {
      deleteList({ boardId, listId: selectedListId });
      setDeleteDialogOpen(false);
      setSelectedListId(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading Lists...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error?.message}</div>;
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">My Lists</h1>
        <Button className="p-5" onClick={handleAddNew}>
          <CirclePlus className="h-5 w-5 mr-2" />
          Add List
        </Button>
      </div>


<div className="flex gap-4 px-4 py-4 pb-4 overflow-x-auto h-full items-start">
  {lists?.map((list) => (
    <Card key={list.id} className="flex flex-col w-72 min-w-72 shrink-0 max-h-full bg-white shadow-sm border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {list.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              <MoreHorizontalIcon className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditClick(list)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDeleteClick(list.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="text-sm text-gray-500">
          Position: {list.position}
        </div>
      </CardHeader>

      <div className="flex-1 px-4 py-2 overflow-y-auto min-h-0">
        <Cards listId={list.id} />
      </div>
    </Card>
  ))}
  
  <Button
    variant="outline"
    className="w-72 min-w-72 h-50 border-dashed shrink-0"
    onClick={handleAddNew}
  >
    <CirclePlus className="h-8 w-8 mr-2" />
    Add List
  </Button>
</div>


      <ListForm
        boardId={boardId}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        editData={selectedList}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete List?"
        description="Are you sure you want to delete this List? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
};

export default List;
