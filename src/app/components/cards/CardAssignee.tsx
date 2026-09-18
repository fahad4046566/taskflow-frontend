import { SelectFormField } from "@/app/shared/SelectFormField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useBoardMembers,
  useCardAssignees,
  useCreateCardAssignee,
  useDeleteCardAssignee,
} from "@/hooks/useCardAssignees";
import { CardAssignee } from "@/types/card-assignee";
import { MoreHorizontalIcon, Trash } from "lucide-react";
import { useState } from "react";

const CardAssignees = ({
  cardId,
  boardId,
}: {
  cardId: number;
  boardId: number;
}) => {
  const {
    data: assignees,
    isLoading,
    isError,
    error,
  } = useCardAssignees(cardId);
  const { data: members } = useBoardMembers({ boardId });
  const { mutate: addAssignee } = useCreateCardAssignee();
  const { mutate: removeAssignee } = useDeleteCardAssignee();

  const [selectValue, setSelectValue] = useState<string | null>(null);

  const unassignedMembers = members?.filter(
    (member) =>
      !assignees?.some((assignee) => assignee.userId === member.userId),
  );
  // Dropdown se select hone par:
  const handleAssign = (userId: number) => {
    if (!userId) return;
     setSelectValue(null);
    addAssignee(
      { cardId, data: { userId } },
      {
        onSuccess: () => setSelectValue(""), // dropdown reset
      },
    );
  };

  // Remove button par:
  const handleRemove = (userId: number) => {
    removeAssignee({ cardId, userId });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading Cards...</div>;
  }

  if (isError) {
    return <div className="text-red-500">Error: {error?.message}</div>;
  }

  // ... UI (list + dropdown, jaisa Comments/Cards mein pattern tha)
  return (
    <>
      <Card>
        {assignees?.length === 0 ? (
          <p className="text-gray-500 text-center">
            No assignees found. Create one!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {assignees?.map((assignee: CardAssignee) => (
              <Card key={assignee.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {assignee.user.name}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="outline" />}>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleRemove(assignee.userId)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent className="flex-1">
                  <CardDescription className="text-sm text-gray-600"></CardDescription>
                </CardContent>
                <CardFooter className="text-xs text-gray-400 border-t pt-2 flex justify-between items-center">
                  Created: {new Date(assignee.assignedAt).toLocaleDateString()}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        <CardFooter>
          <SelectFormField
            value={selectValue}
            onValueChange={(val) => {
              if (val) handleAssign(Number(val));
            }}
            options={
              unassignedMembers?.map((member) => ({
                value: String(member.userId),
                label: member.user.name,
              })) ?? []
            }
            placeholder="+ Add Assignee"
          />
        </CardFooter>
      </Card>
    </>
  );
};

export default CardAssignees;
