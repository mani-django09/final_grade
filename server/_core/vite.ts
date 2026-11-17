import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// wouter routes this SPA actually serves — anything outside this list is a
// genuine 404, not a client-side page, so it should be reported as one.
const KNOWN_ROUTES = new Set([
  "/",
  "/grade-calculator",
  "/gpa-calculator",
  "/high-school-gpa-calculator",
  "/weighted-gpa-calculator",
  "/cumulative-gpa-calculator",
  "/ap-score-calculator",
  "/sat-score-calculator",
  "/test-grade-calculator",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/404",
]);

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(
    express.static(distPath, {
      // The prerendered index.html files live in per-route subdirectories
      // (e.g. dist/public/grade-calculator/index.html for /grade-calculator).
      // express.static's defaults would treat "/grade-calculator" as a
      // directory request and 301 it to "/grade-calculator/" before serving
      // that directory's index file automatically — pre-empting the route
      // table below and its status-code handling entirely. Turning both off
      // leaves this middleware serving only exact static file paths (assets,
      // robots.txt, ...), so app.use("*", ...) is the single source of truth
      // for what each route path actually returns.
      redirect: false,
      index: false,

      // Vite content-hashes everything under /assets/ (the filename changes
      // whenever the contents do), so those files are safe to cache forever.
      // The HTML files keep revalidating on every request so deploys show up
      // immediately.
      setHeaders: (res, filePath) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    })
  );

  // Each known route has its own prerendered HTML — real page content and
  // the correct <title>/description/canonical baked in, not just a generic
  // shell — captured from the client bundle so crawlers and link-preview
  // bots that don't execute JS still see the right thing. React still fully
  // takes over on load (this app uses createRoot, not hydrateRoot), so
  // there's no hydration-mismatch risk.
  // The generic shell (whatever "/" built to) is the fallback for a route
  // whose own prerendered snapshot is missing — e.g. a build where the
  // prerender step was skipped. Better to serve something than crash startup.
  const genericShell = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");
  const routeHtml = new Map<string, string>();
  for (const route of Array.from(KNOWN_ROUTES)) {
    const file = route === "/" ? "index.html" : `${route.slice(1)}/index.html`;
    const filePath = path.resolve(distPath, file);
    if (fs.existsSync(filePath)) {
      routeHtml.set(route, fs.readFileSync(filePath, "utf-8"));
    } else {
      console.warn(`No prerendered file for ${route} at ${filePath} — falling back to the generic shell.`);
      routeHtml.set(route, genericShell);
    }
  }
  // Anything outside KNOWN_ROUTES is a genuine 404: reporting it as 200 (a
  // "soft 404") lets search engines index broken URLs as if they were valid
  // pages. The 404 page's own prerendered content doubles as the body here,
  // so the response looks like what it says it is instead of showing some
  // other page's content under a 404 status.
  const notFoundHtml = routeHtml.get("/404")!;

  app.use("*", (req, res) => {
    // Express resolves req.path relative to where a route is mounted, and a
    // "*" mount consumes the whole URL — so req.path here is always "/",
    // regardless of what was actually requested. req.originalUrl still has
    // it, just with the query string riding along, which the map doesn't
    // expect: strip that before looking it up.
    const pathname = req.originalUrl.split("?")[0];
    const html = routeHtml.get(pathname);
    if (html) {
      res.status(200).type("html").send(html);
    } else {
      res.status(404).type("html").send(notFoundHtml);
    }
  });
}
