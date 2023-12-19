import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import prismadb from "~/lib/prismadb";
import { requireUserId } from "~/session.server";
import CategoryForm from "../_app.categories._index/category-form";

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const categoryId = params.id;

  const category = await prismadb.category.findFirst({
    where: { id: categoryId },
  });
  return json({ category });
}

export async function action({ params, request }: ActionFunctionArgs) {}

export default function CategoryDetailsPage() {
  const { category } = useLoaderData<typeof loader>();
  console.log(category);

  return <CategoryForm initialData={category} />;
}
