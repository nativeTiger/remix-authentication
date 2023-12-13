import { type LoaderFunctionArgs, defer } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { columns, type User } from "./column";
import { Await, useLoaderData } from "@remix-run/react";
import { DataTable } from "~/components/ui/data-table";
import Search from "./search";
import { Suspense } from "react";
import { InvoicesTableSkeleton } from "~/components/ui/skeleton";

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
  const userDataPromise = getUser({ query });

  return defer({ query, userData: userDataPromise });
}

export default function UserPage() {
  const { userData, query } = useLoaderData<typeof loader>();

  return (
    <>
      <h1>User List</h1>
      <Search placeholder="Search users" query={query} />
      <Suspense fallback={<InvoicesTableSkeleton />}>
        <Await resolve={userData} errorElement="error loading data">
          {(userData) => <DataTable columns={columns} data={userData} />}
        </Await>
      </Suspense>
    </>
  );
}
