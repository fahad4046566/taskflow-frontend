import { DataDrawer } from "@/app/shared/DataDrawer";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComments } from "@/hooks/useComments";
import { CommentFormProps } from "@/types/comment";
import { CreateComment, CreateCommentSchema } from "@/validations/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const CommentForm = ({ open, onOpenChange, cardId }: CommentFormProps) => {
  const { mutate: createComment, isPending: isCreating } = useCreateComments();

  const form = useForm({
    resolver: zodResolver(CreateCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: CreateComment) => {
    createComment(
      { cardId: cardId, data: data },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <DataDrawer
      open={open}
      onOpenChange={onOpenChange}
      title= "Add Comment"
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={isCreating}
    >
      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Comment</FieldLabel>
            <Textarea {...field} />
            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
          </Field>
        )}
      />
    </DataDrawer>
  );
};

export default CommentForm;
