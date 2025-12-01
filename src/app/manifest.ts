import { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Companion",
    short_name: "Companion",
    description: "Your personal AI companion",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/images/comapnion_192px.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/comapnion_512px.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Companion",
        description: "Your personal AI companion",
        url: "/",
        icons: [
          {
            src: "/images/comapnion_192px.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
      },
    ],
    screenshots: [
      {
        src: "/images/screenshot540.png",
        type: "image/png",
        sizes: "540x720",
      },
      {
        src: "/images/screenshot720.png",
        type: "image/png",
        sizes: "720x540",
      },
    ],
  };
}
