import { z } from "zod";
import { type Category } from "@prisma/client";
import { ValidatedForm, useIsSubmitting } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { Input } from "~/components/input/Input";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useState } from "react";
import { useFetcher } from "@remix-run/react";

const CategoryFormFieldSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).trim(),
});

export const CategoryFormFieldValidator = withZod(CategoryFormFieldSchema);

export type CategoryFormType = z.infer<typeof CategoryFormFieldSchema>;

export type CategoryFormFieldNameType = keyof CategoryFormType;

export default function CategoryForm({
  initialData,
}: {
  initialData?: Pick<Category, "name"> | null;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const fetcher = useFetcher();

  const isSubmitting = useIsSubmitting("add-category");
  const label = initialData ? "Update" : "Add";
  const description = initialData
    ? "update existing category"
    : "create new category";

  return (
    <>
      <Button variant="default" onClick={() => setIsEditDialogOpen(true)}>
        {label} Category
      </Button>
      {initialData && (
        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Delete Category
        </Button>
      )}

      {/* Edit Category Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={() => setIsEditDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{label} Category</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <ValidatedForm
              validator={CategoryFormFieldValidator}
              defaultValues={{ name: initialData?.name }}
              method="post"
              className="space-y-3"
              id="add-category"
              fetcher={fetcher}
            >
              <Input type="text" name="name" label="Category Name" />
              <DialogFooter className="sm:justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  aria-disabled={isSubmitting}
                  name="intent"
                  value="update"
                >
                  {label}
                </Button>
              </DialogFooter>
            </ValidatedForm>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Cateogory</DialogTitle>
          </DialogHeader>
          <DialogDescription>Are you sure want to delete ?</DialogDescription>
          <div className="flex items-center space-x-2 justify-end">
            <fetcher.Form method="post">
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  variant="destructive"
                  aria-disabled={fetcher.state === "submitting"}
                  name="intent"
                  value="delete"
                >
                  Confirm
                </Button>
              </DialogFooter>
            </fetcher.Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
