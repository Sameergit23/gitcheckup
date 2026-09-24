"use client";

import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { normalizeUsername } from "@/lib/username";

export function UsernameForm({
  variant = "hero",
  examples = [],
}: {
  variant?: "hero" | "compact";
  /** Usernames offered as "Try it" chips that fill the field and run the checkup. */
  examples?: string[];
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hero = variant === "hero";

  function run(raw: string): boolean {
    const username = normalizeUsername(raw);
    if (!username) {
      setError(raw.trim() ? "That doesn't look like a GitHub username." : "Type a GitHub username first.");
      return false;
    }
    setError(null);
    router.push(`/u/${username}`);
    return true;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (run(value)) setValue("");
  }

  return (
    // action/method keep the form working before JS loads (handled by app/u/route.ts).
    <form action="/u" method="get" onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-3">
      <label
        htmlFor={inputId}
        className={hero ? "text-sm font-bold uppercase tracking-widest" : "sr-only"}
      >
        GitHub username
      </label>
      <div className={`flex flex-col gap-4 ${hero ? "sm:flex-row" : "min-[480px]:flex-row"}`}>
        <div className="flex min-w-0 flex-1 border-3 border-ink bg-white shadow-brut-sm focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-[3px] focus-within:outline-ink">
          <span
            aria-hidden="true"
            className={`flex items-center border-r-3 border-ink bg-yellow font-display ${hero ? "px-4 text-2xl" : "px-3 text-xl"}`}
          >
            @
          </span>
          <input
            id={inputId}
            name="username"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder={hero ? "octocat" : "check another user"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={`w-full min-w-0 bg-transparent font-mono font-bold outline-none placeholder:font-normal placeholder:text-muted ${
              hero ? "px-4 py-3 text-lg" : "px-3 py-2 text-base"
            }`}
          />
        </div>
        <BrutalButton type="submit" color="pink" size={hero ? "lg" : "md"} className="shrink-0">
          Run checkup →
        </BrutalButton>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-sm font-bold text-issue">
          ✗ {error}
        </p>
      )}
      {examples.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <span className="font-bold uppercase tracking-widest">Try it:</span>
          {examples.map((name) => (
            <BrutalButton
              key={name}
              size="sm"
              className="font-mono normal-case tracking-normal"
              onClick={() => {
                setValue(name);
                run(name);
              }}
            >
              <span className="sr-only">Run a checkup for </span>@{name}
            </BrutalButton>
          ))}
        </div>
      )}
    </form>
  );
}
