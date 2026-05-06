import { CircleHelp } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { pdfToolsNavItems } from "@/config/navigation/pdf-tools-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
                    tooltip={item.description}
                  >
                    <Link
                      aria-disabled={item.disabled ? true : undefined}
                      to={item.disabled ? pathname : item.path}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuAction
                        aria-label={`What ${item.label} does`}
                        className="text-background/55  hover:text-background focus-visible:text-background mr-2"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                        }}
                        type="button"
                      >
                        <CircleHelp className="size-3.5" />
                      </SidebarMenuAction>
                    </TooltipTrigger>

                    <TooltipContent
                      align="center"
                      className="max-w-56 text-pretty"
                      side="right"
                    >
                      {item.description}
                    </TooltipContent>
                  </Tooltip>
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
