import { type Category } from "@prisma/client";
import { NavLink, useLocation } from "@remix-run/react";

type CategorySidebarProps = {
  categoryList: Pick<Category, "id" | "name">[];
};

export default function CategorySidebar({
  categoryList,
}: CategorySidebarProps) {
  const { pathname } = useLocation();
  return (
    <aside className="p-4 col-start-1 col-end-1 h-full overflow-y-auto scrollbar bg-white">
      <ul className="block space-y-1">
        <NavLink
          to={`/categories`}
          className={
            pathname === "/categories"
              ? "nav__item nav__item--active"
              : "nav__item"
          }
        >
          All
        </NavLink>
        {categoryList.length > 0 ? (
          categoryList.map((category, index) => (
            <li key={index}>
              <NavLink
                to={`/categories/${category.id}`}
                className={({ isActive, isPending }) =>
                  isActive
                    ? "nav__item nav__item--active"
                    : isPending
                    ? "nav__item nav__item--active"
                    : "nav__item"
                }
              >
                {category.name}
              </NavLink>
            </li>
          ))
        ) : (
          <h5 className="py-4 text-center text-gray-400 font-medium">
            No category found
          </h5>
        )}
      </ul>
    </aside>
  );
}
