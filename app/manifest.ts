import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tuesday Lounge Bar",
    short_name: "Tuesday",
    description: "Lounge café в Актау",
    start_url: "/",
    display: "standalone",
    background_color: "#e7e7e5",
    theme_color: "#111213",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

