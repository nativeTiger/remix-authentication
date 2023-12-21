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
      <Outlet />
    </section>
  );
}

// export const CategoryLayout = () => {
//   //   const { pathname } = useLocation();

//   return (
//     <>
//       <h1>Category layout</h1>
//       <Outlet />
//     </>
//     // <aside className="p-4 col-span-1 h-full overflow-y-auto scrollbar bg-white">
//     //   <ul className="block space-y-1">
//     //     <NavLink
//     //       to={`/categories`}
//     //       className={
//     //         pathname === "/categories"
//     //           ? "nav__item nav__item--active"
//     //           : "nav__item"
//     //       }
//     //     >
//     //       All
//     //     </NavLink>
//     //     {categoriesOption.length > 0 ? (
//     //       categoriesOption.map((category, index) => (
//     //         <li key={index}>
//     //           <NavLink
//     //             to={`/categories/${category.value}`}
//     //             className={({ isActive, isPending }) =>
//     //               isActive
//     //                 ? "nav__item nav__item--active"
//     //                 : isPending
//     //                 ? "pending"
//     //                 : "nav__item"
//     //             }
//     //           >
//     //             {category.label}
//     //           </NavLink>
//     //         </li>
//     //       ))
//     //     ) : (
//     //       <h5 className="py-4 text-center text-gray-400 font-medium">
//     //         No category found
//     //       </h5>
//     //     )}
//     //   </ul>
//     // </aside>
//   );
// };
