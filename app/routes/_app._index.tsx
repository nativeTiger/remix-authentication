import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import React from "react";
import { useOptionalUser } from "~/lib/route-utils";
import { requireUserId } from "~/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  return json({});
}

export default function Index() {
  const user = useOptionalUser();

  if (user) {
    return (
      <>
        <h1>Welcome, Dr. {user.name}</h1>
        <section className="py-6">
          <div className="grid sm:grid-cols-4 gap-4">
            <div className="bg-green-200 rounded-md h-48 w-full"></div>
            <div className="bg-green-200 rounded-md h-48 w-full"></div>
            <div className="bg-green-200 rounded-md h-48 w-full"></div>
            <div className="bg-green-200 rounded-md h-48 w-full"></div>
          </div>
        </section>
        <section>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-pink-200 col-span-2 rounded-md h-96 w-full"></div>
            <div className="bg-orange-200 rounded-md h-96 w-full"></div>
          </div>
        </section>
      </>
    );
  }
}
