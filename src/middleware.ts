import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/uploadthing",
    "/favicon.ico",
    "/api/webhook/stripe",
    "/manifest.ts",
    "/manifest.webmanifest",
  ],
  ignoredRoutes: ["/api/uploadthing"],
});

export const config = {
  matcher: ["/((?!.+.[]+$|_next).*)", "/(api|trpc)(.*)"],
};
