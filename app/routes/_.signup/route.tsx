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
import { createUser } from "~/models/user.server";
import { getUserId } from "~/session.server";

export const validator = withZod(
  z.object({
    name: z.string().min(1, { message: "Name is required" }),
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

  const { email, password, name } = result.data;

  await createUser({ email, name, password });

  return redirect("/login");
};

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <ValidatedForm validator={validator} method="post" className="space-y-2">
        <Input type="text" name="name" label="Name" />
        <Input type="email" name="email" label="Email" />
        <Input type="password" name="password" label="Password" />
        <SubmitButton />
      </ValidatedForm>
    </div>
  );
}
