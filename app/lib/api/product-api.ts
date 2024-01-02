import { getUserId } from "~/session.server";
import prismadb from "../prismadb";

export type ProductDataType = {
  name: string;
  description: string;
  price: number | string;
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
  const userId = await getUserId(request);
  return await prismadb.product.findMany({ where: { userId } });
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
