import QuickStats from "./quick-stats";
import FaqSearch from "./faq-search";
import RecentActivity from "./recent-activity";
import PlayerSpotlight from "./player-spotlight";

export default function Sidebar() {
  return (
    <div className="space-y-6">
      <QuickStats />
      <FaqSearch />
      <RecentActivity />
      <PlayerSpotlight />
    </div>
  );
}
