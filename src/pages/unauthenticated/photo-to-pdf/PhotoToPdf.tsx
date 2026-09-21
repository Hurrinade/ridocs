import PhotoToPdfCanvas from "@/components/photo-to-pdf/PhotoToPdfCanvas";
import RouteMeta from "@/components/common/RouteMeta";
import { getPdfToolNavItem } from "@/config/navigation/pdf-tools-nav";

const tool = getPdfToolNavItem("photo-to-pdf");

export default function PhotoToPdf() {
  return (
    <>
      <RouteMeta title={tool.label} path={tool.path} />
      <PhotoToPdfCanvas />
    </>
  );
}
