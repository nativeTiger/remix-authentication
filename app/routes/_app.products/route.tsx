import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return json({});
}

export default function ProductPage() {
  return <h1>Product Page</h1>;
}
