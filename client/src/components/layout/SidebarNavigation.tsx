import { useAuth } from "../../hooks/useAuth";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileEdit,
  Calendar,
  FileText,
  Award,
  FileCheck,
} from "lucide-react";

const menuItems = {
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Mahasiswa", icon: Users, path: "/admin/mahasiswa" },
    { label: "Dosen", icon: GraduationCap, path: "/admin/dosen" },
    { label: "Mata Kuliah", icon: BookOpen, path: "/admin/mata-kuliah" },
  ],
  dosen: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dosen" },
    { label: "Kelas Saya", icon: BookOpen, path: "/dosen/kelas" },
    { label: "Jadwal Mengajar", icon: Calendar, path: "/dosen/jadwal" },
    { label: "Input Nilai", icon: FileEdit, path: "/dosen/input-nilai" },
    { label: "Profil", icon: Users, path: "/dosen/profil" },
  ],
  mahasiswa: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/mahasiswa" },
    { label: "KRS", icon: FileText, path: "/mahasiswa/krs" },
    { label: "KHS", icon: Award, path: "/mahasiswa/khs" },
    { label: "Transkrip", icon: FileCheck, path: "/mahasiswa/transkrip" },
    { label: "Jadwal", icon: Calendar, path: "/mahasiswa/jadwal" },
    { label: "Profil", icon: Users, path: "/mahasiswa/profil" },
  ],
};

export const SidebarNavigation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const currentMenu = menuItems[user.role] || [];

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      {/* Logo/Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">SIAKAD Menu</h2>
        <p className="text-sm text-gray-500 capitalize">{user.role}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {currentMenu.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {user.nama?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.nama}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
