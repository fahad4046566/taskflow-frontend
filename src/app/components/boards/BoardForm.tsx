import { VISIBILITY_OPTIONS } from "@/app/constants/board";
import { DataDrawer } from "@/app/shared/DataDrawer";
import { SelectFormField } from "@/app/shared/SelectFormField";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateBoards, useUpdateBoards } from "@/hooks/useBoard";
import { BoardFormProps, CreateBoard } from "@/types/board";
import { CreateBoardSchema } from "@/validations/board";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const BoardForm = ({ open, onOpenChange, editData = null }: BoardFormProps) => {
  const { mutate: createBoard, isPending: isCreating } = useCreateBoards();
  const { mutate: updateBoard, isPending: isUpdating } = useUpdateBoards();

  const form = useForm({
    resolver: zodResolver(CreateBoardSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: "private",
    },
  });
  useEffect(() => {
    if (editData) {
      form.reset({
        title: editData.title || "",
        description: editData.description || "",
        visibility: editData.visibility || "private",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        visibility: "private",
      });
    }
  }, [editData, open, form]);

  const onSubmit = (data: CreateBoard) => {
    if (editData) {
      updateBoard(
        { id: editData.id, data: data },
        {
          onSuccess: () => {
            form.reset();
            onOpenChange(false);
          },
        },
      );
    } else {
      createBoard(data, {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      });
    }
  };

  return (
    <DataDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={editData ? "Edit Board" : "Add Board"}
      onSubmit={form.handleSubmit(onSubmit)}
      isSubmitting={editData ? isUpdating : isCreating}
    >
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Title</FieldLabel>
            <Input {...field} />
            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
          </Field>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Description</FieldLabel>
            <Input {...field} />
            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
          </Field>
        )}
      />
       <Controller
        name="visibility"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Visibility</FieldLabel>
            <SelectFormField
              onValueChange={field.onChange}
              value={field.value}
              options={VISIBILITY_OPTIONS}
              placeholder="Select Visibility"
            />
            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
          </Field>
        )}
      />
    </DataDrawer>
  );
};

export default BoardForm;
