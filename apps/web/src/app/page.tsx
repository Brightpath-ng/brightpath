import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// "/" is never actually shown -- it's the landing spot Clerk sends users to
// after sign-in (fallbackRedirectUrl="/" on the SignIn/SignUp pages) and the
// default destination for anyone hitting the app root directly. Its only job
// is to dispatch to the right place. Unlike the four role route groups, "/"
// isn't inside any of them, so requireRole() in a layout can't cover it --
// this page needs its own auth check.
export default async function Home() {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const role = sessionClaims?.publicMetadata?.role;
  redirect(role ? `/${role}` : "/pending");
}
