
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, BarChart, Activity, Settings, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
    },
    {
      name: "Track",
      href: "/track",
      icon: PlusCircle,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart,
    },
    {
      name: "Progress",
      href: "/progress",
      icon: Activity,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar p-4 min-h-screen",
        className
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Navigation</h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link to={item.href} key={item.name}>
                <Button
                  variant={currentPath === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    currentPath === item.href && "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
