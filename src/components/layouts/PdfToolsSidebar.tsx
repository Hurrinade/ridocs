import { Link, useLocation, useNavigate } from "react-router";
import { pdfToolsNavItems } from "@/config/navigation/pdf-tools-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export default function PdfToolsSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-5">
        <div className="space-y-1">
          <p
            className="font-heading cursor-pointer text-[1.8rem] leading-none tracking-[-0.04em] text-background"
            onClick={() => navigate("/")}
          >
            Rinament
          </p>
          <p className="text-sm text-background/66">PDF tools</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-0 py-4">
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {pdfToolsNavItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    asChild
                    className="h-11 rounded-none px-3 text-sm"
                    isActive={pathname === item.path}
                    size="lg"
                  >
                    <Link
                      aria-disabled={item.disabled ? true : undefined}
                      to={item.disabled ? pathname : item.path}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
