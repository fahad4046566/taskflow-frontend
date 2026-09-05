import { z } from "zod";

const VisibilityEnum = z.enum(["private", "public", "workspace"])
export const CreateBoardSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required").max(500, "Description is too long"),
  visibility: VisibilityEnum.default("private"),
});
export type CreateBoard = z.infer<typeof CreateBoardSchema>;