import { Marquee } from "@/components/Marquee";

const CHECKS = [
  "README",
  "DESCRIPTION",
  "LIVE LINK",
  "LINK ACTUALLY WORKS",
  "LICENSE",
  "RECENT ACTIVITY",
  "TOPICS",
];

/** Full-width black ticker listing every check. */
export function ChecksMarquee() {
  return <Marquee label="What gets checked" items={CHECKS} />;
}
