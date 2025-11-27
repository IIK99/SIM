import { Sidebar, SidebarInset } from "../ui/sidebar";
import { Header } from "../layout/Header";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Sidebar />
      <SidebarInset className="h-svh overflow-hidden bg-gray-50/50">
        <Header />
        <main className="flex-1 overflow-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </SidebarInset>
    </>
  );
};
