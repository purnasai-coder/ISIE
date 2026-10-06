"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { TacticalButton } from "@/components/ui/TacticalButton";
import { useAuth } from "@/lib/auth/AuthContext";

export function LandingHeaderActions() {
  const { loginDemo } = useAuth();

  return (
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      <Link href="/signin">
        <TacticalButton variant="secondary" size="sm" icon={<LogIn className="w-3.5 h-3.5" />}>
          SIGN IN
        </TacticalButton>
      </Link>
      <TacticalButton
        variant="primary"
        size="sm"
        onClick={loginDemo}
        icon={<ArrowRight className="w-3.5 h-3.5" />}
      >
        Enter ISIE Demo
      </TacticalButton>
    </div>
  );
}

export function LandingHeroActions() {
  const { loginDemo } = useAuth();

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-16 sm:mb-20">
      <TacticalButton
        variant="primary"
        size="lg"
        onClick={loginDemo}
        icon={<ArrowRight className="w-4 h-4" />}
      >
        Enter ISIE Demo
      </TacticalButton>
      <Link href="/signin">
        <TacticalButton variant="secondary" size="lg" icon={<LogIn className="w-4 h-4" />}>
          Sign In
        </TacticalButton>
      </Link>
    </div>
  );
}
