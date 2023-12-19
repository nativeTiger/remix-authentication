import { z } from "zod";
import { ValidatedForm, useIsSubmitting } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { Input } from "~/components/input/Input";
import { Button } from "~/components/ui/button";
import { type Category } from "@prisma/client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

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
  const isSubmitting = useIsSubmitting("add-category");
  const label = initialData ? "Update Category" : "Add Category";
  const description = initialData
    ? "update existing category"
    : "create new category";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">{label}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <ValidatedForm
            validator={CategoryFormFieldValidator}
            defaultValues={{ name: initialData?.name }}
            method="post"
            className="space-y-3"
            id="add-category"
          >
            <Input type="text" name="name" label="Category Name" />
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" aria-disabled={isSubmitting}>
                Create
              </Button>
            </DialogFooter>
          </ValidatedForm>
        </div>
      </DialogContent>
    </Dialog>
  );
}
