import { Prisma } from "@prisma/client";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { getUserId, requireUserId } from "~/session.server";
import prismadb from "~/lib/prismadb";
import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
  redirect,
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
  console.log("url", request.url);
  const userId = await getUserId(request);
  if (!userId) return json({ message: "unauthenticate" });
  const session = await getMessageSession(request);
  const formData = await request.formData();
  try {
    if (formData.get("intent") === "update") {
      const result = await CategoryFormFieldValidator.validate(formData);

      if (result.error) {
        return validationError(result.error);
      }

      const { name } = result.data;

      await prismadb.category.update({
        data: { name },
        where: { id: params.id, userId },
      });

      setSuccessMessage(session, "Category updated successfully");
      return redirect(request.url, {
        headers: { "Set-Cookie": await messageCommitSession(session) },
      });
    }

    if (formData.get("intent") === "delete") {
      await prismadb.category.delete({
        where: { id: params.id, userId },
      });
      setSuccessMessage(session, "Category deleted successfully");
      return redirect("/categories", {
        headers: { "Set-Cookie": await messageCommitSession(session) },
      });
    }
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
