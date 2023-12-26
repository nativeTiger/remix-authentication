import { useField } from "remix-validated-form";
import { DEFAULT_IMAGE } from "~/lib/constants";
import { type ProductFormFieldNameType } from "~/routes/_app.products/product-form";
import { Button } from "~/components/ui/button";

type ImageUploadInputProps = {
  name: ProductFormFieldNameType;
  imageUrl?: string | undefined;
};

export default function ImageUploadInput({
  name,
  imageUrl,
}: ImageUploadInputProps) {
  const { getInputProps, error, clearError } = useField(name);

  const handleProfileImageUpload = () => {
    const profileImageUploadInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    profileImageUploadInput?.click();

    profileImageUploadInput.addEventListener("change", (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) {
        if (file.type.split("/")[0] !== "image") {
          return;
        }
        const reader = new FileReader();
        reader.onload = function () {
          const imagePreview = document.getElementById(
            "image-preview"
          ) as HTMLImageElement;
          imagePreview.setAttribute("src", reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  return (
    <div>
      <div className="flex items-center space-x-4 flex-wrap">
        <img
          src={imageUrl ?? DEFAULT_IMAGE}
          alt="previewimage"
          id="image-preview"
          className="h-16 w-16 rounded-full border border-solid border-gray_C3C1BF object-cover place-content-start"
        />
        <div>
          <input
            type="file"
            accept="image/*"
            {...getInputProps({ onChange: () => clearError() })}
            id="image-upload"
            hidden
          />
          <label
            htmlFor="image-upload"
            className="text-sm text-grey-400 font-normal flex items-center"
            onClick={(event) => {
              event.preventDefault();
              handleProfileImageUpload();
            }}
          >
            <Button type="button" className="mr-2">
              upload product image
            </Button>
          </label>
        </div>
      </div>
      {error && (
        <p className="pt-1 text-red-500">
          <span className="pl-2">{error}</span>
        </p>
      )}
    </div>
  );
}
