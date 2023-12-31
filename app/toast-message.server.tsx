import type { Session } from "@remix-run/node";
import { createCookieSessionStorage } from "@remix-run/node";

export type ToastMessage = { message: string; type: "success" | "error" };

// const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

export const { commitSession: messageCommitSession, getSession } =
  createCookieSessionStorage({
    cookie: {
      name: "__message",
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      // expires: new Date(Date.now() + ONE_YEAR),
      secrets: [process.env.MESSAGE_SECRET as string],
      secure: true,
    },
  });

export function setSuccessMessage(session: Session, message: string) {
  session.flash("toastMessage", { message, type: "success" } as ToastMessage);
}

export function setErrorMessage(session: Session, message: string) {
  session.flash("toastMessage", { message, type: "error" } as ToastMessage);
}

export function getMessageSession(request: Request) {
  const cookie = request.headers.get("cookie");
  return getSession(cookie);
}
