import { ValidatedForm, validationError } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
} from "@remix-run/node";
import { z } from "zod";
import { Input } from "~/components/input/Input";
import { SubmitButton } from "~/components/button/SubmitButton";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";

export const validator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
    password: z.string().min(1, { message: "Password is required" }),
  })
);

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    return validationError(result.error);
  }

  const { email, password } = result.data;

  const user = await verifyLogin({ email, password });

  if (!user) {
    return;
  }

  return createUserSession({ request, userId: user.id });
};

export default function LoginPage() {
  return (
    <ValidatedForm validator={validator} method="post">
      <Input name="email" label="Email" />
      <Input name="password" label="Password" />
      <SubmitButton />
    </ValidatedForm>
  );
}
