import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { LogOut, User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "../ui/sidebar";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 px-6 backdrop-blur-xl transition-all">
      <SidebarTrigger className="-ml-2" />

      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <div className="h-8 w-px bg-border/50" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full ring-2 ring-white/50 transition-all hover:ring-primary/20"
              >
                <Avatar className="h-10 w-10 border border-border">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-600 text-white font-medium">
                    {getInitials(user?.nama || "User")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.nama}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.role} • {user?.nim || user?.nidn || "Admin"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate(`/${user?.role}/profil`)}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
