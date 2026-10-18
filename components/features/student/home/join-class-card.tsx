"use client";

import { useJoinClass } from "./use-join-class";

export function JoinClassCard() {
  const { code, setCode, isJoining, submit } = useJoinClass();

  return (
    <section className="flex flex-col gap-3 rounded-[20px] border-[1.5px] border-pace-line bg-white p-[22px]">
      <h2 className="text-base font-bold leading-snug tracking-[-0.005em] text-pace-ink">Join a class</h2>
      <p className="text-[13px] leading-normal text-pace-ink-2">
        Enter the 6-character code your instructor shared.
      </p>
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. KEBQ3D"
          maxLength={6}
          disabled={isJoining}
          aria-label="Class join code"
          className="h-10 min-w-0 flex-1 rounded-xl border-[1.5px] border-pace-line-strong px-3.5 font-mono text-[13px] uppercase text-pace-ink outline-none placeholder:normal-case placeholder:text-pace-muted"
        />
        <button
          type="submit"
          disabled={isJoining}
          className="h-10 shrink-0 cursor-pointer rounded-full bg-pace-ink px-[18px] text-sm font-bold text-white disabled:opacity-60"
        >
          {isJoining ? "Joining" : "Join"}
        </button>
      </form>
    </section>
  );
}
