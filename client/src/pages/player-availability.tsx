import { AvailabilityTracker } from "@/components/player/availability-tracker";

export function PlayerAvailability() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4 p-6 rounded-xl bg-gradient-to-r from-blue-500/20 via-green-500/20 to-blue-500/20 border border-blue-500/30">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 bg-clip-text text-transparent">
          Player Availability
        </h1>
        <p className="text-lg text-blue-300">
          Track player availability and injury status
        </p>
      </div>

      <AvailabilityTracker showAllTeams={true} />
    </div>
  );
}