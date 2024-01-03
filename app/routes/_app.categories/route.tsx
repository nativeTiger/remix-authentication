import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/session.server";
import { getAllCategories } from "~/lib/api/category-api";
import CategorySidebar from "./category-sidebar";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const categories = await getAllCategories(request);
  return json({ categories });
}
export default function CategoryLayout() {
  const { categories } = useLoaderData<typeof loader>();
  console.log("[CATEGORIES]", categories);
  return (
    <section className="grid grid-cols-4 gap-4 max-h-screen grid-rows-[70vh]">
      <CategorySidebar categoryList={categories} />
      <div className="col-start-2 col-end-5">
        <Outlet />
      </div>
    </section>
  );
}
