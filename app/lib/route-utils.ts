import type { User } from "@prisma/client";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

/**
 * @description return the loader data
 * @param id
 * @returns
 */
export function useMatchData(id: string): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () =>
      matchingRoutes.find((route) => route.id === id) as
        | Record<string, unknown>
        | undefined,
    [matchingRoutes, id]
  );
  return route?.data as Record<string, unknown> | undefined;
}

/**
 * @description user is User ==> Type predicates in TypeScript are functions that return a boolean value and
 *              are used to narrow down the type of a variable.
 * @param user
 * @returns boolean
 */
function isUser(user: any): user is User {
  return user && typeof user === "object" && typeof user.email === "string";
}

/**
 * @description return the loader data from the root route
 * @returns user data | undefined
 */
export function useOptionalUser(): User | undefined {
  const data = useMatchData("root");

  if (!data || !isUser(data?.user)) return undefined;
  return data.user;
}
