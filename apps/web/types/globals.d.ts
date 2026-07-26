import type { RoleName } from "@brightpath/types";

export {};

// Clerk's documented pattern for typing session claims/user metadata: augment
// its ambient interfaces so auth().sessionClaims.publicMetadata is a RoleName,
// not an untyped blob, everywhere it's read (middleware.ts today, more later).
declare global {
  interface CustomJwtSessionClaims {
    publicMetadata: {
      role?: RoleName;
    };
  }
}
