import { NegotiationCenter } from "@/components/contracts/negotiation-center";

export function ContractNegotiations() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4 p-6 rounded-xl bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-500/20 border border-green-500/30">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
          Contract Negotiations
        </h1>
        <p className="text-lg text-green-300">
          Manage player contracts and salary negotiations
        </p>
      </div>

      <NegotiationCenter showAllTeams={true} />
    </div>
  );
}