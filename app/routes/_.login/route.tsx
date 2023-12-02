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
    rememberMe: z.literal("on").optional(),
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

  const { email, password, rememberMe } = result.data;

  const user = await verifyLogin({ email, password });
  if (!user) {
    return redirect("/login");
  }

  return createUserSession({ request, userId: user.id, rememberMe });
};

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <ValidatedForm validator={validator} method="post" className="space-y-3">
        <Input type="email" name="email" label="Email" />
        <Input type="password" name="password" label="Password" />
        <Input type="checkbox" name="rememberMe" label="Remember me" />
        <SubmitButton />
      </ValidatedForm>
    </div>
  );
}
