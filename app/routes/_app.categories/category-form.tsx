import { z } from "zod";
import { ValidatedForm, useIsSubmitting } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { Input } from "~/components/input/Input";
import { Button } from "~/components/ui/button";

const CategoryFormFieldSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).trim(),
});

export const CategoryFormFieldValidator = withZod(CategoryFormFieldSchema);

export type CategoryFormType = z.infer<typeof CategoryFormFieldSchema>;

export type CategoryFormFieldNameType = keyof CategoryFormType;

export default function CategoryForm() {
  const isSubmitting = useIsSubmitting("add-category");

  return (
    <div className="flex items-center space-x-2">
      <ValidatedForm
        validator={CategoryFormFieldValidator}
        method="post"
        className="space-y-3"
        id="add-category"
      >
        <Input type="text" name="name" label="Category Name" />
        {/* <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>

              <DialogClose asChild></DialogClose>
            </DialogFooter> */}
        <Button type="submit" aria-disabled={isSubmitting}>
          Create
        </Button>
      </ValidatedForm>
    </div>
  );
}
