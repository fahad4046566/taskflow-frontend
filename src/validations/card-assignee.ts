import { z } from "zod";

export const CreateCardAssigneeSchema = z.object({
  userId: z.int().min(1)
});
export type CreateCardAssignee  = z.infer<typeof CreateCardAssigneeSchema>;
