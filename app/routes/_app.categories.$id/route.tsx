import { Prisma } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { getUserId, requireUserId } from "~/session.server";
import prismadb from "~/lib/prismadb";
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import CategoryForm, {
  CategoryFormFieldValidator,
} from "~/routes/_app.categories._index/category-form";
import {
  getMessageSession,
  messageCommitSession,
  setErrorMessage,
  setSuccessMessage,
} from "~/toast-message.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const categoryId = params.id;

  const category = await prismadb.category.findFirst({
    where: { id: categoryId },
  });
  return json({ category });
}

export async function action({ params, request }: ActionFunctionArgs) {
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

    const category = await prismadb.category.update({
      data: { name },
      where: { id: params.id, userId },
    });

    setSuccessMessage(session, "Category updated successfully");

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
}

export default function CategoryDetailsPage() {
  const { category } = useLoaderData<typeof loader>();
  return <CategoryForm initialData={category} />;
}
