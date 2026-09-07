"use client";

import List from "@/app/components/lists/List";
import { useParams } from "next/navigation";

export default function BoardDetailPage() {
  const params = useParams();
   const boardId = Number(params.boardId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Board ID: {boardId}</h1>
      <List boardId={boardId}/>
    </div>
  );
}