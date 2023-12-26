import {
  type ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { getUserId, requireUserId } from "~/session.server";
import ProductForm, { ProductFormFieldValidator } from "./product-form";
import { getMessageSession } from "~/toast-message.server";
import { validationError } from "remix-validated-form";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await getUserId(request);
  if (!userId) return json({ message: "unauthenticate" });
  const session = await getMessageSession(request);

  const result = await ProductFormFieldValidator.validate(
    await request.formData()
  );
  console.log(session);

  if (result.error) {
    return validationError(result.error);
  }
}

export default function ProductPage() {
  return (
    <>
      <h1>Product Page</h1>
      <ProductForm />
    </>
  );
}
