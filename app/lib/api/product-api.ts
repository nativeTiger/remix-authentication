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
