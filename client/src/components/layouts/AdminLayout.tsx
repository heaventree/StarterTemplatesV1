import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  ListFilter,
  LogOut,
  Tag,
  LayoutTemplate,
  Users,
  Tags,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    {
      name: "Templates",
      icon: <LayoutTemplate className="mr-2 h-4 w-4" />,
      href: "/admin/templates",
    },
    {
      name: "Categories",
      icon: <ListFilter className="mr-2 h-4 w-4" />,
      href: "/admin/categories",
    },
    {
      name: "Tags",
      icon: <Tag className="mr-2 h-4 w-4" />,
      href: "/admin/tags",
    },
    {
      name: "Labels",
      icon: <Tags className="mr-2 h-4 w-4" />,
      href: "/admin/labels",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-30 bg-background">
        <div className="flex h-16 items-center px-4 sm:px-6">
          <Link href="/admin/templates" className="flex items-center gap-2 font-semibold">
            <LayoutTemplate className="h-6 w-6" />
            <span>Template Admin</span>
          </Link>
          <nav className="flex items-center ml-6 space-x-4 lg:space-x-6 hidden md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center text-sm transition-colors hover:text-primary ${
                  location === item.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user?.username?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        {children}
      </main>

      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t p-2">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 text-xs ${
                location === item.href
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              <div className="mb-1">{item.icon}</div>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}