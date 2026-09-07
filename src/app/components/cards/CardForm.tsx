import { PRIORITY_OPTIONS } from "@/app/constants/card";
import { DataDrawer } from "@/app/shared/DataDrawer";
import { SelectFormField } from "@/app/shared/SelectFormField";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useCreateCards, useUpdateCards } from "@/hooks/useCards";
import { CardFormProps, CreateCard } from "@/types/card";
import { CreateCardSchema } from "@/validations/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

const CardForm = ({
  open,
  onOpenChange,
  listId,
  editData = null,
}: CardFormProps) => {
  const { mutate: createCard, isPending: isCreating } = useCreateCards();
  const { mutate: updateCard, isPending: isUpdating } = useUpdateCards();

  const form = useForm({
    resolver: zodResolver(CreateCardSchema),
    defaultValues: {
      title: "",
      description: "",
      position: 0,
      dueDate: "",
      priority: "LOW",
    },
  });
  useEffect(() => {
    if (editData) {
      form.reset({
        title: editData.title || "",
        description: editData.description || "",
        position: editData.position || 0,
        dueDate: editData.dueDate || "",
        priority: editData.priority || "LOW",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        position: 0,
        dueDate: "",
        priority: "LOW",
      });
    }
  }, [editData, open, form]);

  const onSubmit = (data: CreateCard) => {
    if (editData) {
      updateCard(
        { listId, cardId: editData.id, data: data },
        {
          onSuccess: () => {
            form.reset();
            onOpenChange(false);
          },
        },
      );
    } else {
      createCard(
        { listId: listId, data: data },
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
      title={editData ? "Edit Card" : "Add Card"}
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
      <Controller
        name="dueDate"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Expected Closed Date</FieldLabel>
            <Input
              type="date"
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value || null)}
              placeholder="Select Due Date"
            />
            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
          </Field>
        )}
      />

      <Controller
        name="priority"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Priority</FieldLabel>
            <SelectFormField
              onValueChange={field.onChange}
              value={field.value}
              options={PRIORITY_OPTIONS}
              placeholder="Select Visibility"
            />
            <FieldError errors={fieldState.error ? [fieldState.error] : []} />
          </Field>
        )}
      />
    </DataDrawer>
  );
};

export default CardForm;
