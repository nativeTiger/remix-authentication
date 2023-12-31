import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { getUserId, requireUserId } from "~/session.server";
import ProductForm, { ProductFormFieldValidator } from "./product-form";
import { validationError } from "remix-validated-form";
import { getAllCategories } from "~/lib/api/category-api";
import { useLoaderData } from "@remix-run/react";
import { type ProductDataType, addProduct } from "~/lib/api/product-api";
import {
  getMessageSession,
  messageCommitSession,
  setSuccessMessage,
} from "~/toast-message.server";

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
    const result = await ProductFormFieldValidator.validate(
      await request.formData()
    );

    if (result.error) {
      return validationError(result.error);
    }
    const { name, category, description, price } = result.data;

    const productData: ProductDataType = {
      name,
      categoryId: category,
      description,
      price,
      imageUrl: "",
    };
    const isProductAdded = await addProduct({ request, productData });
    isProductAdded
      ? setSuccessMessage(session, "Product added succesfully")
      : setSuccessMessage(session, "Cannot create product");
    return json(
      { category },
      { headers: { "Set-Cookie": await messageCommitSession(session) } }
    );
  } catch (error) {}
}

export default function ProductPage() {
  const { categoryOptions } = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Product Page</h1>
      <ProductForm options={categoryOptions} />
    </>
  );
}
