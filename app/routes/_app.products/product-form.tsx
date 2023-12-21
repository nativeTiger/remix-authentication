import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { ValidatedForm, useIsSubmitting } from "remix-validated-form";
import { Input } from "~/components/input/Input";
import ImageUploadInput from "~/components/input/image-upload-input";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

const MAX_FILE_SIZE_MB = 15;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ProductFormFieldSchema = z.object({
  productImage: zfd.file(
    z
      .custom<File | undefined>()
      .refine((file) => {
        if (file instanceof File) {
          return ACCEPTED_IMAGE_TYPES.includes(file.type);
        }
        return true;
      }, "Please choose .jpg, .jpeg, .png, and .webp files.")
      .refine((file) => {
        if (file instanceof File) {
          return file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
        }
        // No file provided, so consider it valid
        return true;
      }, "Max file size is 15MB.")
  ),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  price: z.number().min(1, { message: "Product price is required" }),
  category: z.string().min(1, { message: "Category is required" }),
});

export const ProductFormFieldValidator = withZod(ProductFormFieldSchema);

export type ProductFormType = z.infer<typeof ProductFormFieldSchema>;

export type ProductFormFieldNameType = keyof ProductFormType;

export default function ProductForm() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isSubmitting = useIsSubmitting("add-product");

  return (
    <>
      <Button variant="default" onClick={() => setIsOpen(true)}>
        Add Product
      </Button>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Add new product</DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <ValidatedForm
              method="post"
              validator={ProductFormFieldValidator}
              id="add-product"
            >
              <Input type="text" name="name" label="Name" />
              <Input type="text" name="description" label="Description" />
              <Input type="number" name="price" label="Price" />
              <ImageUploadInput name="productImage" />
              <DialogFooter className="sm:justify-end">
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
    </>
  );
}
