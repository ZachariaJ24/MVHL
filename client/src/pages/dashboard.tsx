import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AIToolsPanel from "@/components/ai-tools/ai-tools-panel";
import Sidebar from "@/components/sidebar/sidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sports Analytics Dashboard</h1>
          <p className="text-gray-600">Generate AI-powered insights, commentary, and analysis for hockey teams and players</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AIToolsPanel />
          </div>
          <div>
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
