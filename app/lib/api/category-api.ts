import { type Category } from "@prisma/client";
import prismadb from "~/lib/prismadb";
import { getUserId } from "~/session.server";

/**
 *
 * @param request
 * @returns List of Categories
 */
export async function getAllCategories(
  request: Request
): Promise<Pick<Category, "id" | "name">[]> {
  const userId = await getUserId(request);
  const categoryList = await prismadb.category.findMany({
    where: { userId },
  });
  return categoryList;
}
