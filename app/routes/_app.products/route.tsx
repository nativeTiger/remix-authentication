import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type UploadHandler,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import { getUserId, requireUserId } from "~/session.server";
import ProductForm, { ProductFormFieldValidator } from "./product-form";
import { validationError } from "remix-validated-form";
import { getAllCategories } from "~/lib/api/category-api";
import { useActionData, useLoaderData } from "@remix-run/react";
import { type ProductDataType, addProduct } from "~/lib/api/product-api";
import {
  getMessageSession,
  messageCommitSession,
  setSuccessMessage,
} from "~/toast-message.server";
import { uploadImage } from "~/lib/cloudinary.server";
import { type UploadApiResponse } from "cloudinary";
import { DEFAULT_IMAGE } from "~/lib/constants";

export type CategoryOptionType = {
  label: string;
  value: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);

  const categories = await getAllCategories(request);

  const categoryOptions: CategoryOptionType[] = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
  return json({ categoryOptions });
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await getUserId(request);
  if (!userId) return json({ message: "unauthenticate" });
  const session = await getMessageSession(request);

  try {
    const uploadHandler: UploadHandler = composeUploadHandlers(
      async ({ name, data }) => {
        if (name === "productImage" && data) {
          try {
            const uploadedImage = (await uploadImage(
              data
            )) as UploadApiResponse;
            return uploadedImage.secure_url;
          } catch (error) {
            return DEFAULT_IMAGE;
          }
        }
        return undefined;
      },
      createMemoryUploadHandler()
    );

    const formData = await parseMultipartFormData(request, uploadHandler);

    const result = await ProductFormFieldValidator.validate(formData);

    if (result.error) {
      return validationError(result.error);
    }

    // Check if the "productImage" exists in the form data
    const imageUrl = formData.get("productImage") as string;

    const { name, category, description, price } = result.data;

    const productData: ProductDataType = {
      name,
      categoryId: category,
      description,
      price,
      imageUrl,
    };

    const isProductAdded = await addProduct({ request, productData });
    isProductAdded
      ? setSuccessMessage(session, "Product added successfully")
      : setSuccessMessage(session, "Cannot create product");

    return json(
      { category },
      { headers: { "Set-Cookie": await messageCommitSession(session) } }
    );
  } catch (error) {
    console.error("Error in action:", error);
    return json({});
  }
}

export default function ProductPage() {
  const actionData = useActionData<typeof action>();
  console.log("action data", actionData);

  const { categoryOptions } = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Product Page</h1>
      <ProductForm options={categoryOptions} />
    </>
  );
}
