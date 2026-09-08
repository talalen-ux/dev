/**
 * Render the landing page into a single self-contained HTML file for publishing
 * as a Claude Artifact.
 *
 * The artifact host wraps whatever it is given in its own <!doctype>/<head>/
 * <body>, so this cannot ship an <html> or <body> tag. Two things follow, and
 * both are why this is a script rather than a copy-paste:
 *
 *   1. next/font puts its --font-* variables on a class it expects to sit on
 *      <html>. There is no <html> here, so a tiny inline script moves those
 *      classes onto document.documentElement at load. Without it --font-sans
 *      resolves to nothing and the whole page silently falls back to the
 *      system stack.
 *   2. The dark palette is keyed on :root[data-theme="dark"], which the host's
 *      own root would swallow. It is rewritten to a body-scoped attribute the
 *      toggle sets directly.
 *
 * Usage: node scripts/artifact.mjs [outfile]   (runs `next build` first)
 */

import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const PORT = 3123;
const OUT =
  process.argv[2] ??
  "/tmp/claude-0/-home-user-dev/f15182dd-5706-5de7-9e3e-333359592ddf/scratchpad/resident.html";

const run = (cmd, args) =>
  new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: "inherit" });
    p.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)),
    );
  });

async function waitFor(url, tries = 60) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server never came up at ${url}`);
}

/** Inner HTML of <body>, and the class list Next put on <html>. */
function split(html) {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/);
  if (!body) throw new Error("no <body> in the rendered page");
  const cls = html.match(/<html[^>]*\sclass="([^"]*)"/);
  if (!cls) throw new Error("no class on <html> — the font variables are lost");
  return { body: body[1], htmlClass: cls[1] };
}

await run("npm", ["run", "build"]);

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: "ignore",
  detached: true,
});

try {
  const base = `http://127.0.0.1:${PORT}`;
  await waitFor(base);

  const page = await (await fetch(base)).text();
  const { body: rendered, htmlClass } = split(page);

  // The RSC flight payload re-encodes the whole page and points at chunk URLs
  // that do not exist once this is a standalone file. It is dead weight here.
  // Every route but "/" is likewise absent, so internal links become anchors.
  const body = rendered
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/href="\/method"/g, 'href="#risk"')
    .replace(/href="\/"/g, 'href="#"');

  const hrefs = [...page.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((h) => h.startsWith("/"));
  if (!hrefs.length) throw new Error("no stylesheets found in the built page");

  let css = (
    await Promise.all(
      hrefs.map(async (h) => (await fetch(base + h)).text()),
    )
  ).join("\n");

  // See (2) above. Both quoted and unquoted forms, since minifiers drop quotes.
  css = css.replace(
    /:root\[data-theme=("dark"|dark)\]/g,
    "body[data-resident-theme=dark]",
  );

  const script = `(function () {
  ${JSON.stringify(htmlClass)}.split(" ").filter(Boolean)
    .forEach(function (c) { document.documentElement.classList.add(c); });
  document.body.dataset.residentTheme = "light";
  var toggle = document.querySelector('[role="switch"]');
  if (toggle) {
    var knob = toggle.querySelector("span");
    toggle.addEventListener("click", function () {
      var dark = toggle.getAttribute("aria-checked") !== "true";
      toggle.setAttribute("aria-checked", String(dark));
      document.body.dataset.residentTheme = dark ? "dark" : "light";
      if (knob) knob.style.left = dark ? "19px" : "3px";
    });
  }
})();`;

  writeFileSync(
    OUT,
    `<title>Resident</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;600&family=Chivo+Mono&family=Roboto+Mono&display=swap">
<style>
${css}
body { margin: 0; }
</style>
${body}
<script>
${script}
</script>
`,
  );

  console.log(`wrote ${OUT} (${(css.length / 1024) | 0}KB css)`);
} finally {
  process.kill(-server.pid);
}
