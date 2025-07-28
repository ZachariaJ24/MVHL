import { WaiversSystem } from "@/components/waivers/waivers-system";

export function Waivers() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4 p-6 rounded-xl bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 border border-orange-500/30">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
          Waivers System
        </h1>
        <p className="text-lg text-orange-300">
          Claim players placed on waivers
        </p>
      </div>

      <WaiversSystem showAllTeams={true} />
    </div>
  );
}