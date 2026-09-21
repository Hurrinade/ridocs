import { siteConfig } from "@/config/site";

type RouteMetaProps = {
  title?: string;
  path: string;
};

/**
 * Per-route title and canonical. React 19 hoists `<title>` and `<link>`
 * rendered inside components into `<head>`, so no effect is needed. The
 * description and social tags stay static in index.html because crawlers
 * that skip JavaScript read those, and the first `<meta>` in the document
 * wins anyway.
 */
export default function RouteMeta({ title, path }: RouteMetaProps) {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const canonical = new URL(path, siteConfig.url).toString();

  return (
    <>
      <title>{fullTitle}</title>
      <link rel="canonical" href={canonical} />
    </>
  );
}
