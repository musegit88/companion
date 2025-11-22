import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/uploadthing",
    "/favicon.ico",
    "/api/webhook/stripe",
    "/manifest.ts",
    "/manifest.webmanifest",
    "/images/comapnion_192px.png",
    "/images/comapnion_512px.png",
    "/images/comapnion48px.png",
    "/images/comapnion72px.png",
    "/images/comapnion96px.png",
    "/images/homescreen-main.png",
    "/images/homescreen.png",
    "/images/maskable_icon_x192.png",
    "/images/maskable_icon_x512.png",
    "/images/screenshot540.png",
    "/images/screenshot720.png",
    "/images/Square44x44Logo.altform-unplated_targetsize-32.png",
    "/.well-known/appspecific/com.chrome.devtools.json",
  ],
  ignoredRoutes: ["/api/uploadthing"],
});

export const config = {
  matcher: ["/((?!.+.[]+$|_next).*)", "/(api|trpc)(.*)"],
};
