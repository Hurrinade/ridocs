import { Link } from "react-router";
import RouteMeta from "@/components/common/RouteMeta";
import { legalConfig } from "@/config/legal";
import { pdfToolsNavItems } from "@/config/navigation/pdf-tools-nav";
import ToolCardItem from "@/components/root/ToolCardItem";

export default function Root() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <RouteMeta path="/" />
      <header className="space-y-3">
        <h1 className="font-heading text-4xl leading-none tracking-[-0.04em] text-foreground sm:text-5xl">
          RiDocs
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Choose a PDF tool to get started.
        </p>
      </header>

      <section
        aria-label="Available PDF tools"
        className="mt-8 flex gap-4 sm:mt-10 flex-wrap"
      >
        {pdfToolsNavItems.map((item) => {
          const cardContent = <ToolCardItem item={item} />;

          if (item.disabled) {
            return (
              <div
                aria-disabled="true"
                className="cursor-not-allowed opacity-60"
                key={item.key}
              >
                {cardContent}
              </div>
            );
          }

          return (
            <Link className="block h-full" key={item.key} to={item.path}>
              {cardContent}
            </Link>
          );
        })}
      </section>

      <footer className="mt-auto border-t border-border/70 pt-6 text-sm text-muted-foreground">
        <p>
          {legalConfig.appName} &mdash; built by{" "}
          <a
            className="transition-colors hover:text-foreground"
            href={legalConfig.companyWebsite}
          >
            {legalConfig.companyName}
          </a>
          , Zagreb. Files stay in your browser and are never sent to a server.
        </p>
      </footer>
    </div>
  );
}
