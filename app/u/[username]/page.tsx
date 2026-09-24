import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { UsernameForm } from "@/components/UsernameForm";
import { ReportView } from "@/components/report/ReportView";
import { normalizeUsername } from "@/lib/username";

type Props = { params: { username: string } };

function usernameFrom(params: Props["params"]) {
  return normalizeUsername(decodeURIComponent(params.username));
}

export function generateMetadata({ params }: Props): Metadata {
  const username = usernameFrom(params) ?? "not found";
  return {
    title: `GitCheckup · ${username}`,
    description: `GitHub repo health report for ${username}: README, live link, license, activity and topics.`,
  };
}

export default function ReportPage({ params }: Props) {
  const username = usernameFrom(params);

  return (
    <>
      <header className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-4 py-6 sm:px-8 md:flex-row md:items-center md:justify-between">
        <Logo href="/" />
        <div className="w-full md:max-w-md">
          <UsernameForm variant="compact" />
        </div>
      </header>
      {username ? (
        <ReportView key={username} username={username} />
      ) : (
        <main className="flex-1 px-4 py-10 sm:px-8">That&apos;s not a valid GitHub username.</main>
      )}
    </>
  );
}
