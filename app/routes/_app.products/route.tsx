import { type FormEvent, Suspense } from "react";
import { debounce } from "~/lib/utils";
import { uploadImage } from "~/lib/cloudinary.server";
import { type UploadApiResponse } from "cloudinary";
import { DEFAULT_IMAGE } from "~/lib/constants";
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
  defer,
} from "@remix-run/node";
import {
  Await,
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
import { SearchIcon } from "lucide-react";
import { ProductTableSkeleton } from "~/components/ui/skeleton";

export type CategoryOptionType = {
  label: string;
  value: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);

  const products = getAllProduct(request);

  const categories = await getAllCategories(request);

  const categoryOptions: CategoryOptionType[] = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  return defer({ products, categoryOptions });
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

  const { categoryOptions, products } = useLoaderData<typeof loader>();

  const { columns } = useColumns();

  const [searchParams] = useSearchParams();

  const debounceSubmit = debounce((form: any) => submit(form), 300);
  const handleSubmit = (event: FormEvent<HTMLFormElement>) =>
    debounceSubmit(event.currentTarget);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <Form method="get" onChange={handleSubmit}>
          <div className="relative">
            <input
              type="search"
              name="search"
              placeholder="Search"
              className="outline-none w-full mt-1 text-gray-500 border-2 rounded-md pr-4 pl-10 py-1.5 duration-200 focus:border-gray-600"
              defaultValue={searchParams.get("search") || ""}
            />
            <span className="absolute top-3 left-3">
              <SearchIcon className="text-gray-400" />
            </span>
          </div>
        </Form>
        <ProductForm options={categoryOptions} />
      </div>
      <Suspense fallback={<ProductTableSkeleton />}>
        <Await
          resolve={products}
          errorElement={
            <p className="text-center text-red-400">
              Error loading Product List
            </p>
          }
        >
          {({ productList, count }) => (
            <>
              <DataTable columns={columns} data={productList} />
              <PaginationWrapper pageSize={PER_PAGE} totalCount={count} />
            </>
          )}
        </Await>
      </Suspense>
      {/* <div className="flex justify-between items-center py-6">
        <div className="mt-4" aria-live="polite">
          <p>{`Displaying ${productList.length} of ${count}.`}</p>
        </div>
      </div> */}
      {/* <PaginationWrapper pageSize={PER_PAGE} totalCount={17} /> */}
    </>
  );
}
