import type { User } from "@prisma/client";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { getUserById } from "./models/user.server";

const USER_SESSION_KEY = "userId";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET as string],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("cookie");
  return sessionStorage.getSession(cookie);
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
}

export async function createUserSession({
  request,
  userId,
  rememberMe,
}: {
  request: Request;
  userId: string;
  rememberMe: "on" | undefined;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: rememberMe === "on" ? 60 * 60 * 24 * 7 : 60 * 60 * 24 * 1,
      }),
    },
  });
}

export async function getUserId(
  request: Request
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUserDetails(request: Request) {
  const userId = await getUserId(request);

  if (userId === undefined) return null;

  const user = await getUserById(userId);

  if (user) return user;

  throw await logout(request);
}

export async function requireUserId(request: Request) {
  const userId = await getUserId(request);

  if (!userId) {
    throw redirect("/login");
  }

  return userId;
}
