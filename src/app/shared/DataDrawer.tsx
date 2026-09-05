"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useMediaQuery } from "@/hooks/use-media-query";
import { DataDrawerProps, DataFormProps } from "@/types/data-drawer";

const DataForm = ({ children, onSubmit }:DataFormProps) => {
  return (
    <form id="taskflow-data-form" onSubmit={onSubmit} className="space-y-4">
      <FieldGroup>{children}</FieldGroup>
    </form>
  );
};

export function DataDrawer({
  open,
  onOpenChange,
  title,
  children,
  onSubmit,
  isSubmitting,
}:DataDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formComponent = (
    <DataForm onSubmit={onSubmit} isSubmitting={isSubmitting}>
      {children}
    </DataForm>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className=" sm:max-w-106.25 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {formComponent}

          <div className="shrink-0 px-4 py-4 border-t">
            <Button
              type="submit"
              form="taskflow-data-form"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-0 flex flex-col h-[85vh]">
        <DrawerHeader className="text-left px-4 pt-4 pb-2 shrink-0 border-b">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <form id="taskflow-data-form" onSubmit={onSubmit} className="space-y-4">
            <FieldGroup>{children}</FieldGroup>
          </form>
        </div>
        <div className="shrink-0 px-4 py-4 border-t">
          <Button
            type="submit"
            form="taskflow-data-form"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
