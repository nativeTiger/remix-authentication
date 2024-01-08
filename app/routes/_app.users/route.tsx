import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { columns, type User } from "./column";
import { useLoaderData } from "@remix-run/react";
import { DataTable } from "~/components/ui/data-table";
import Search from "./search";
import { useTable } from "~/hooks/useTable";

async function getUser({ query }: { query: string | null }): Promise<User[]> {
  const baseUrl = "http://localhost:3000/users?_limit=5";
  const url = query ? `${baseUrl}?q=${query}` : baseUrl;
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const response = await fetch(url);
  const results = await response.json();
  return results;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const url = new URL(request.url);
  const query = url.searchParams.get("search");
  const userDataPromise = await getUser({ query });
  return json({ query, userData: userDataPromise });
}

export default function UserPage() {
  const { userData, query } = useLoaderData<typeof loader>();
  const { table } = useTable(columns, userData);
  return (
    <>
      <h1>User List</h1>
      <Search placeholder="Search users" query={query} />
      <DataTable table={table} />
    </>
  );
}
