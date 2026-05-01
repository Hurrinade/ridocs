import { Outlet } from "react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import PdfToolsSidebar from "@/components/layouts/PdfToolsSidebar";

export default function PdfToolsLayout() {
  return (
    <SidebarProvider defaultOpen>
      <PdfToolsSidebar />
      <SidebarInset className="min-h-svh bg-transparent">
        <div className="min-h-svh">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
