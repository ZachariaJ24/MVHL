import { Button } from "@/components/ui/button";

export default function PlayerSpotlight() {
  return (
    <div className="bg-gradient-to-br from-primary to-blue-600 rounded-lg shadow-sm p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Player Spotlight</h3>
      <div className="text-center">
        <img 
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150" 
          alt="Featured player headshot" 
          className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-white" 
        />
        <p className="font-semibold">Nathan MacKinnon</p>
        <p className="text-sm opacity-90">Colorado Avalanche</p>
        <Button className="mt-3 bg-white text-primary hover:bg-gray-100 text-sm font-medium">
          View Profile
        </Button>
      </div>
    </div>
  );
}
