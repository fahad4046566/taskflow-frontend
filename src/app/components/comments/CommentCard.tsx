import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CirclePlus, MoreHorizontalIcon, Trash } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/app/shared/ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useComments, useDeleteComments } from "@/hooks/useComments";
import { Comment } from "@/types/comment";
import CommentForm from "./CommentForm";

const Comments = ({ cardId }: { cardId: number }) => {
  const { data: comments, isLoading, isError, error } = useComments(cardId);
  const { mutate: deleteComment } = useDeleteComments();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleAddNew = () => {
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedCommentId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCommentId !== null) {
      deleteComment({ cardId, id: selectedCommentId });
      setDeleteDialogOpen(false);
      setSelectedCommentId(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading Comments...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error?.message}</div>;
  }

  return (
    <>
      <Card>
        {comments?.length === 0 ? (
          <p className="text-gray-500 text-center">
            No Comments found. Be first one!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {comments?.map((comment: Comment) => (
              <Card key={comment.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {comment.content}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" />}>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDeleteClick(comment.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardFooter className="text-xs text-gray-400 border-t pt-2 flex justify-between items-center">
                  Created: {new Date(comment.createdAt).toLocaleDateString()}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        <CardFooter>
          <Button className="w-full" variant="outline" onClick={handleAddNew}>
            <CirclePlus className="h-5 w-5 mr-2" />
            Add Comment
          </Button>
        </CardFooter>
      </Card>
      <CommentForm
        cardId={cardId}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Comment?"
        description="Are you sure you want to delete this Comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </>
  );
};

export default Comments;
