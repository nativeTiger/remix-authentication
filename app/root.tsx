import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import stylesheet from "~/tailwind.css";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";
import {
  getMessageSession,
  messageCommitSession,
  type ToastMessage,
} from "~/toast-message.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getMessageSession(request);

  const toastMessage = session.get("toastMessage") as ToastMessage;

  if (!toastMessage) {
    return json({ toastMessage: null });
  }

  if (!toastMessage.type) {
    throw new Error("Message should have a type");
  }

  return json(
    { toastMessage },
    { headers: { "Set-Cookie": await messageCommitSession(session) } }
  );
};
export default function App() {
  const { toastMessage } = useLoaderData<typeof loader>();

  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    const { message, type } = toastMessage;

    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      default:
        throw new Error(`${type} is not handled`);
    }
  }, [toastMessage]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <main>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Toaster />
      </body>
    </html>
  );
}
