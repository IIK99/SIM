import { Sidebar, SidebarInset, SidebarProvider } from "../ui/sidebar";
import { Header } from "../layout/Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="h-svh overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
