import { type Prisma } from "@prisma/client";
import { getUserId } from "~/session.server";
import prismadb from "~/lib/prismadb";

export type ProductDataType = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
};

type AddProductPayloadType = {
  request: Request;
  productData: ProductDataType;
};
export async function addProduct({
  request,
  productData,
}: AddProductPayloadType): Promise<boolean> {
  const userId = (await getUserId(request)) as string;

  const product = await prismadb.product.create({
    data: {
      ...productData,
      userId,
    },
  });
  return product ? true : false;
}

export async function getAllProduct(request: Request) {
  const PER_PAGE = 2;

  const url = new URL(request.url);
  const query = url.searchParams;
  const currentPage = Math.max(Number(query.get("page")) || 1, 1);

  const userId = await getUserId(request);

  const options: Prisma.ProductFindManyArgs = {
    take: PER_PAGE,
    skip: (currentPage - 1) * PER_PAGE,
    where: { userId },
  };
  const countOptions: Prisma.ProductCountArgs = {};

  if (query.get("search")) {
    options.where = {
      name: {
        contains: query.get("search") as string,
      },
    };
    countOptions.where = options.where;
  }
  const productListPromise = prismadb.product.findMany(options);
  const countPromise = prismadb.product.count(countOptions);

  const [productList, count] = await Promise.all([
    productListPromise,
    countPromise,
  ]);

  return { productList, count };
}

export async function getProductByCategory({
  request,
  categoryId,
}: {
  request: Request;
  categoryId: string | undefined;
}) {
  const userId = await getUserId(request);
  return await prismadb.product.findMany({ where: { userId, categoryId } });
}
