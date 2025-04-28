import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  LayoutGrid, 
  LogOut, 
  Menu, 
  Tag, 
  Layers, 
  User,
  X,
  ChevronDown,
  Home,
} from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon, label, isActive, onClick }: NavItemProps) => (
  <Link href={href}>
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      size="sm"
      className="w-full justify-start"
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </Button>
  </Link>
);

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleMobileNavClick = () => {
    if (isSmallScreen) {
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { href: '/admin/templates', icon: <LayoutGrid size={20} />, label: 'Templates' },
    { href: '/admin/categories', icon: <Layers size={20} />, label: 'Categories' },
    { href: '/admin/tags', icon: <Tag size={20} />, label: 'Tags' },
  ];

  const renderNavItems = () => (
    <div className="space-y-1">
      <NavItem 
        href="/" 
        icon={<Home size={20} />} 
        label="Back to Site"
        isActive={false}
        onClick={handleMobileNavClick}
      />
      
      <Separator className="my-2" />
      
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={item.label}
          isActive={location.startsWith(item.href)}
          onClick={handleMobileNavClick}
        />
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-10 border-r bg-background">
        <div className="p-4 border-b">
          <Link href="/admin/templates">
            <h1 className="text-xl font-bold">Template Admin</h1>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {renderNavItems()}
        </div>
        <div className="p-4 border-t">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{user.username}</span>
                  <ChevronDown size={16} className="ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>

      {/* Mobile navbar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 h-14 border-b bg-background z-10 flex items-center justify-between px-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="flex md:hidden">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-4 border-b flex items-center justify-between">
              <h1 className="text-xl font-bold">Template Admin</h1>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={18} />
              </Button>
            </div>
            <div className="p-4">
              {renderNavItems()}
            </div>
            <div className="p-4 border-t">
              {user && (
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{user.username}</span>
                  <LogOut size={16} className="ml-auto" />
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/admin/templates" className="text-lg font-bold">
          Template Admin
        </Link>
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}