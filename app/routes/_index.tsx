import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils/route-utils";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const user = useOptionalUser();

  if (user) {
    return (
      <>
        <h1>Welcome, Dr. {user.name}</h1>
        <Link to="/dashboard">Dashboard</Link>
      </>
    );
  }

  return (
    <>
      <h1>Sorry, nothing to see here 👀</h1>
      <Link to="/login">Log In</Link>
    </>
  );
}
