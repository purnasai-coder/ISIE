import fs from "fs";

/** @type {import('next').NextConfig} */
const isBuild =
  process.argv.includes("build") ||
  process.env.npm_lifecycle_event === "build" ||
  process.env.NODE_ENV === "production";

let envLocalKey = "";
try {
  if (fs.existsSync(".env.local")) {
    const content = fs.readFileSync(".env.local", "utf8");
    const match = content.match(/NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=(.+)/);
    if (match && match[1]) {
      envLocalKey = match[1].trim();
    }
  }
} catch {}

const PROVISIONED_DEMO_KEY = "AIzaSyCPJ8_dk-iSTDIYJTmPypqrT_VbmTbWz1k";
const effectiveKey = envLocalKey || PROVISIONED_DEMO_KEY;

const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: effectiveKey,
  },
  ...(isBuild ? { output: "standalone" } : {}),
  reactStrictMode: false,
  transpilePackages: ["three"],
};

export default nextConfig;

