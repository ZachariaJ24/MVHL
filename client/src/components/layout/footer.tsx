import { Link } from "wouter";
import { Trophy } from "lucide-react";

const FOOTER_LINKS = {
  league: [
    { href: "/standings", label: "Standings" },
    { href: "/stats", label: "Stats" },
    { href: "/matches", label: "Schedule" },
    { href: "/teams", label: "Teams" },
  ],
  community: [
    { href: "/awards", label: "Awards" },
    { href: "/draft-central", label: "Draft Central" },
    { href: "/news", label: "News" },
    { href: "/events", label: "Events" },
  ],
  resources: [
    { href: "/faq", label: "FAQ" },
    { href: "/rules", label: "Rules" },
    { href: "/privacy", label: "Privacy" },
    { href: "/support", label: "Support" },
  ],
  account: [
    { href: "/player", label: "Player Dashboard" },
    { href: "/management", label: "Management" },
    { href: "/admin", label: "Admin" },
    { href: "/about", label: "About" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Site Info */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Trophy className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg">MVHL Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The official digital hub for the Major Virtual Hockey League. 
              Connecting players, teams, and fans.
            </p>
          </div>

          {/* League Links */}
          <div>
            <h3 className="font-semibold mb-3">League</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.league.map((link, index) => (
                <li key={`league-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-semibold mb-3">Community</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.community.map((link, index) => (
                <li key={`community-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-3">Resources</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.resources.map((link, index) => (
                <li key={`resources-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-semibold mb-3">Account</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.account.map((link, index) => (
                <li key={`account-${index}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} MVHL Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}