import { LANDING_OG_ALT, LANDING_OG_SIZE, landingOgImage } from "@/lib/og/landing";

// Edge keeps satori's font loading portable (the Node build trips over Windows paths in dev).
export const runtime = "edge";
export const alt = LANDING_OG_ALT;
export const size = LANDING_OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return landingOgImage();
}
