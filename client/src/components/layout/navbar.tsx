import { Settings, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { settings } from "@/lib/settings";

export function Navbar() {
  const [location] = useLocation();
  const mode = settings.get().mode;

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <a className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                WebSeal {mode === 'notes' ? 'Notes' : 'Todos'}
                <img src="/android-chrome-512x512.png" alt="WebSeal Logo" className="w-6 h-6 ml-2" />
              </a>
            </Link>
            <Badge variant="secondary" className="h-5">v0.2</Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            by webseal.us
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={location === "/" ? "default" : "ghost"}
            size="icon"
            asChild
          >
            <Link href="/">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant={location === "/settings" ? "default" : "ghost"}
            size="icon"
            asChild
          >
            <Link href="/settings">
              <Settings className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}