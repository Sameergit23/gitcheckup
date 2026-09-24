import Link from "next/link";
import { ErrorPanel } from "@/components/ErrorPanel";
import { Footer } from "@/components/Footer";
import { ArrowLeftIcon } from "@/components/Icons";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <>
      <header className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-8">
        <Logo href="/" />
      </header>
      <ErrorPanel
        title="Page not found"
        ticker={["404", "NOTHING HERE", "HEAD BACK HOME"]}
        actions={
          <Link href="/" className="btn bg-white px-4 py-2">
            <ArrowLeftIcon /> Back home
          </Link>
        }
      >
        <p>This page doesn&apos;t exist. To check someone, go to /u/their-username.</p>
      </ErrorPanel>
      <Footer />
    </>
  );
}
