import { z } from "zod";

export const CreateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long (max 1000 characters)"),
});
export type CreateComment = z.infer<typeof CreateCommentSchema>;
