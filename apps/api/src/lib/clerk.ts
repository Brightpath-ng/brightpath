import type { ClerkClient, User } from "@clerk/backend";

export async function findClerkUserByEmail(
  clerk: ClerkClient,
  email: string
): Promise<User | null> {
  const result = await clerk.users.getUserList({ emailAddress: [email] });
  return result.data[0] ?? null;
}

export interface CreateClerkUserInput {
  email: string;
  firstName: string;
  lastName?: string;
}

export function createClerkUser(clerk: ClerkClient, input: CreateClerkUserInput): Promise<User> {
  // This Clerk instance requires a password on user creation by default, but
  // every role signs in the same passwordless email-code way (apps/web's
  // <SignIn> widget) -- skipPasswordRequirement omits it instead of
  // generating a password nobody will ever use.
  return clerk.users.createUser({
    emailAddress: [input.email],
    firstName: input.firstName,
    lastName: input.lastName,
    skipPasswordRequirement: true,
  });
}
