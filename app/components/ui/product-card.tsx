import { type Product } from "@prisma/client";
import { Link } from "@remix-run/react";

type ProductCardProps = Pick<
  Product,
  "imageUrl" | "id" | "name" | "description"
> & { price: string };
export function ProductCard({
  id,
  name,
  imageUrl,
  description,
  price,
}: ProductCardProps) {
  return (
    <figure className="shadow-md rounded-md">
      <img
        src={imageUrl}
        alt=""
        className="rounded-md object-cover h-[13vw] w-full"
      />
      <figcaption className="px-2 py-3 flex flex-col space-y-1">
        <Link
          to={`/products/${id}`}
          className="text-gray-700 font-semibold tracking-wide text-base cursor-pointer hover:text-gray-900 duration-300"
        >
          {name}
        </Link>
        <p className="text-gray-500 text-sm font-normal truncate">
          {description}
        </p>
        <h2 className="text-xl font-semibold text-gray-600">
          ${Number(price)}
        </h2>
      </figcaption>
    </figure>
  );
}
