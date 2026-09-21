import MergeCanvas from "@/components/merge/MergeCanvas";
import RouteMeta from "@/components/common/RouteMeta";
import { getPdfToolNavItem } from "@/config/navigation/pdf-tools-nav";

const tool = getPdfToolNavItem("merge");

export default function Merge() {
  return (
    <>
      <RouteMeta title={tool.label} path={tool.path} />
      <MergeCanvas />
    </>
  );
}
