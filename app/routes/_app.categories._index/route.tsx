import { Prisma } from "@prisma/client";
import { getUserId, requireUserId } from "~/session.server";
import { validationError } from "remix-validated-form";
import prismadb from "~/lib/prismadb";
import {
  type LoaderFunctionArgs,
  json,
  type ActionFunctionArgs,
} from "@remix-run/node";
import {
  messageCommitSession,
  getMessageSession,
  setSuccessMessage,
  setErrorMessage,
} from "~/toast-message.server";
import CategoryForm, {
  CategoryFormFieldValidator,
} from "~/routes/_app.categories._index/category-form";
import { getAllProduct } from "~/lib/api/product-api";
import { useLoaderData } from "@remix-run/react";
import { ProductCard } from "~/components/ui/product-card";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const allProducts = await getAllProduct(request);
  return json({ allProducts });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await getUserId(request);
  if (!userId) return json({ message: "unauthenticate" });

  const session = await getMessageSession(request);
  try {
    const result = await CategoryFormFieldValidator.validate(
      await request.formData()
    );

    if (result.error) {
      return validationError(result.error);
    }

    const { name } = result.data;

    const categoryInput = {
      name,
      userId,
    };

    const category = await prismadb.category.create({ data: categoryInput });

    setSuccessMessage(session, "Category created successfully");

    return json(
      { category },
      { headers: { "Set-Cookie": await messageCommitSession(session) } }
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        setErrorMessage(session, "Category name already exists");
      }
    }

    return json(
      { ok: false },
      {
        headers: { "Set-Cookie": await messageCommitSession(session) },
      }
    );
  }
};

export default function CategoryPage() {
  const { allProducts } = useLoaderData<typeof loader>();
  return (
    <div>
      <CategoryForm />
      <div className="">
        {allProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
}
