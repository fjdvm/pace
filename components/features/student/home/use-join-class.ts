"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { joinClass } from "@/app/actions/join-class";

export function useJoinClass() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter a join code");
      return;
    }
    setIsJoining(true);
    try {
      const result = await joinClass(code);
      if (result.success) {
        toast.success(`Successfully joined class: ${result.className}!`);
        setCode("");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to join class");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsJoining(false);
    }
  };

  return { code, setCode, isJoining, submit };
}
