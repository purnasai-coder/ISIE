import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { TacticalButton } from "@/components/ui/TacticalButton";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-isie-bg-deep text-isie-text-primary flex flex-col items-center justify-center p-6 text-center select-none font-mono">
      <div className="p-8 max-w-md w-full bg-isie-panel border border-white/10 rounded-sm space-y-4">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-sm bg-red-950/50 border border-red-500/50 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
        <div className="text-xl font-bold uppercase tracking-wider text-white">
          404 // Target Sector Not Found
        </div>
        <p className="text-xs text-isie-text-secondary leading-relaxed">
          The requested tactical sector or telemetry coordinate does not exist or has been relocated.
        </p>
        <div className="pt-2 flex justify-center">
          <Link href="/dashboard">
            <TacticalButton variant="primary" size="sm" icon={<ArrowLeft className="w-3.5 h-3.5" />}>
              RETURN TO COMMAND CENTER
            </TacticalButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
