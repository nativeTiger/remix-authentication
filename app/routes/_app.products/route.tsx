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
import {
  useActionData,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import {
  type ProductDataType,
  addProduct,
  getAllProduct,
} from "~/lib/api/product-api";
import {
  getMessageSession,
  messageCommitSession,
  setSuccessMessage,
} from "~/toast-message.server";
import { uploadImage } from "~/lib/cloudinary.server";
import { type UploadApiResponse } from "cloudinary";
import { DEFAULT_IMAGE } from "~/lib/constants";
import { useTable } from "~/hooks/useTable";
import { useColumns } from "./use-columns";
import { DataTable } from "~/components/ui/data-table";
import { useEffect, useState } from "react";
import { Pagination } from "./pagination";

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

  const { productList, count } = await getAllProduct(request);
  return json({ categoryOptions, productList, count });
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
      price: Number(price),
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
  const [currentPage, setCurrentPage] = useState(1);

  console.log("action data", actionData);
  const { categoryOptions, productList, count } =
    useLoaderData<typeof loader>();
  const { columns } = useColumns();
  const { table } = useTable(columns, productList);

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(currentPage));
    setSearchParams(params);
  }, [currentPage]);
  return (
    <>
      <h1>Product Page</h1>
      <ProductForm options={categoryOptions} />
      <DataTable table={table} />
      <div className="mt-4" aria-live="polite">
        <p>{`Displaying ${productList.length} of ${count}.`}</p>
      </div>
      <Pagination
        currentPage={currentPage}
        pageSize={2}
        totalCount={count}
        onPageChange={(pageNumber: number) => setCurrentPage(pageNumber)}
      />
    </>
  );
}
