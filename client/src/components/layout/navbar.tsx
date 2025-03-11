import { Settings, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Notes App
            </a>
          </Link>
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
