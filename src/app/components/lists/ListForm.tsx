import { DataDrawer } from "@/app/shared/DataDrawer";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateLists, useUpdateLists } from "@/hooks/useLists";
import { CreateList, ListFormProps } from "@/types/list";
import { CreateListSchema } from "@/validations/list";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const ListForm = ({
  open,
  onOpenChange,
  boardId,
  editData = null,
}: ListFormProps) => {
  const { mutate: createList, isPending: isCreating } = useCreateLists();
  const { mutate: updateList, isPending: isUpdating } = useUpdateLists();

  const form = useForm({
    resolver: zodResolver(CreateListSchema),
    defaultValues: {
      title: "",
      position: 0,
    },
  });
  useEffect(() => {
    if (editData) {
      form.reset({
        title: editData.title || "",
        position: editData.position || 0,
      });
    } else {
      form.reset({
        title: "",
        position: 0,
      });
    }
  }, [editData, open, form]);

  const onSubmit = (data: CreateList) => {
    if (editData) {
      updateList(
        { boardId: boardId, listId: editData.id, data: data },
        {
          onSuccess: () => {
            form.reset();
            onOpenChange(false);
          },
        },
      );
    } else {
      createList(
        { boardId: boardId, data: data },
        {
          onSuccess: () => {
            form.reset();
            onOpenChange(false);
          },
        },
      );
    }
  };

  return (
    <DataDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={editData ? "Edit List" : "Add List"}
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
        name="position"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Position</FieldLabel>
            <Input
              type="number"
              {...field}
              value={field.value ?? 0} 
              onChange={(e) => {
                const value = e.target.value;
                const num = Number(value);
                field.onChange(isNaN(num) ? 0 : num); 
              }}
            />
            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
          </Field>
        )}
      />
    </DataDrawer>
  );
};

export default ListForm;
