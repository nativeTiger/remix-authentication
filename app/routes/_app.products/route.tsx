import { useEffect, type FormEvent } from "react";
import { debounce } from "~/lib/utils";
import { uploadImage } from "~/lib/cloudinary.server";
import { type UploadApiResponse } from "cloudinary";
import { DEFAULT_IMAGE } from "~/lib/constants";
import { useTable } from "~/hooks/useTable";
import { useColumns } from "~/routes/_app.products/use-columns";
import { DataTable } from "~/components/ui/data-table";
import { getUserId, requireUserId } from "~/session.server";
import { validationError } from "remix-validated-form";
import { getAllCategories } from "~/lib/api/category-api";
import ProductForm, {
  ProductFormFieldValidator,
} from "~/routes/_app.products/product-form";
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  type UploadHandler,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import {
  type ProductDataType,
  addProduct,
  getAllProduct,
  PER_PAGE,
} from "~/lib/api/product-api";
import {
  getMessageSession,
  messageCommitSession,
  setSuccessMessage,
} from "~/toast-message.server";
import { PaginationWrapper } from "~/components/ui/pagination-wrapper";

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
  // const actionData = useActionData<typeof action>();
  // console.log("action data", actionData);
  const submit = useSubmit();

  const { categoryOptions, productList, count } =
    useLoaderData<typeof loader>();

  const { columns } = useColumns();

  const { table, sorting } = useTable(columns, productList);

  const [searchParams, setSearchParams] = useSearchParams();

  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    if (sorting.length > 0) {
      params.set("page", "1");
      params.set("sort", sorting[0].id);
      params.set("order", sorting[0].desc ? "desc" : "asc");
    } else {
      params.delete("sort");
      params.delete("order");
    }
    setSearchParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  const debounceSubmit = debounce((form: any) => submit(form), 300);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) =>
    debounceSubmit(event.currentTarget);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <Form method="get" onChange={handleSubmit}>
          <input
            type="search"
            name="search"
            placeholder="Search"
            className="outline-none w-full mt-1 text-gray-500 border-2 rounded-md px-4 py-1.5 duration-200 focus:border-gray-600"
            defaultValue={searchParams.get("search") || ""}
          />
        </Form>
        <ProductForm options={categoryOptions} />
      </div>
      <DataTable table={table} />
      <div className="flex justify-between items-center py-6">
        <div className="mt-4" aria-live="polite">
          <p>{`Displaying ${productList.length} of ${count}.`}</p>
        </div>
        <PaginationWrapper pageSize={PER_PAGE} totalCount={count} />
      </div>
    </>
  );
}
