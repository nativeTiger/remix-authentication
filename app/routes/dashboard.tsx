import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return json({});
}

export default function DashboardPage() {
  return (
    <>
      <h1>Dashboard Page</h1>
      <Form action="/logout" method="post">
        <button type="submit">Logout</button>
      </Form>
    </>
  );
}
