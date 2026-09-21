import OrganizeCanvas from "@/components/organize/OrganizeCanvas";
import RouteMeta from "@/components/common/RouteMeta";
import { getPdfToolNavItem } from "@/config/navigation/pdf-tools-nav";

const tool = getPdfToolNavItem("organize");

export default function Organize() {
  return (
    <>
      <RouteMeta title={tool.label} path={tool.path} />
      <OrganizeCanvas />
    </>
  );
}
