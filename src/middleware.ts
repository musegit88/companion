import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/uploadthing",
    "/favicon.ico",
    "/api/webhook/stripe",
  ],
  ignoredRoutes: ["/api/uploadthing"],
});

export const config = {
  matcher: ["/((?!.+.[]+$|_next).*)", "/(api|trpc)(.*)"],
};
