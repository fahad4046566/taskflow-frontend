"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardDetailProps } from "@/types/card";
import Comments from "../comments/CommentCard";
import CardAssignees from "./CardAssignee";

export default function CardDetail(
  { open, onOpenChange, card,boardId }: CardDetailProps,
) {
  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{card.title}</DialogTitle>
        </DialogHeader>

        {/* Section 1 — Card Info (read-only) */}
        <div className="space-y-1 text-sm">
          <p className="text-gray-600">{card.description}</p>
          <p>Priority: {card.priority}</p>
          {card.dueDate && (
            <p>Due: {new Date(card.dueDate).toLocaleDateString()}</p>
          )}
        </div>

        <hr />

        {/* Section 2 — Assignees (baad mein banayenge) */}
        <div>
          <h3 className="font-semibold mb-2">Assignees</h3>
          <CardAssignees cardId={card.id} boardId={boardId} />
        </div>

        <hr />

        {/* Section 3 — Comments (already bana hua hai) */}
        <div>
          <h3 className="font-semibold mb-2">Comments</h3>
          <Comments cardId={card.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
