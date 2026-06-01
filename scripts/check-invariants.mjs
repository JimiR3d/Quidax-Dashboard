#!/usr/bin/env node
/**
 * scripts/check-invariants.mjs — fail CI if any of the project's
 * non-negotiable rules have been violated. These are the rules called out
 * in the README's "Things to know" section that are mechanically checkable.
 *
 * Each check prints a single line on success and a clear diagnostic on
 * failure. Exits with code 1 on the first failure category that fires
 * (we still run every check so a single CI run reports every problem).
 *
 * Why a custom script instead of an ESLint rule:
 *   - Some rules (no tailwind.config.js, no middleware.ts) are about file
 *     existence, not file contents — outside ESLint's scope.
 *   - Keeping all four rules in one place means a future contributor
 *     finds them by grep instead of by archaeology.
 */

import { readFileSync, existsSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { execSync } from "node:child_process"

const ROOT = process.cwd()
let failed = false

function fail(category, msg) {
  failed = true
  console.error(`\n[invariants] FAIL · ${category}`)
  console.error(msg)
}

function pass(category, msg) {
  console.log(`[invariants] ok   · ${category} — ${msg}`)
}

// ---------------------------------------------------------------------------
// 1. No tailwind.config.{js,ts,cjs,mjs}. Tailwind v4 puts theme tokens in
//    app/globals.css under @theme. A re-introduced config file silently
//    splits the source of truth and the design tokens drift.
// ---------------------------------------------------------------------------
{
  const candidates = [
    "tailwind.config.js",
    "tailwind.config.ts",
    "tailwind.config.cjs",
    "tailwind.config.mjs",
  ]
  const found = candidates.filter((f) => existsSync(join(ROOT, f)))
  if (found.length) {
    fail(
      "no-tailwind-config",
      `Found ${found.join(", ")}. This project is Tailwind v4: theme tokens belong in app/globals.css under @theme. Delete the config file.`,
    )
  } else {
    pass("no-tailwind-config", "Tailwind v4 @theme is the only source of truth")
  }
}

// ---------------------------------------------------------------------------
// 2. No middleware.ts at the project root. Next 16 renamed it to proxy.ts.
//    A reintroduced middleware.ts will be ignored (or duplicated) and we
//    lose the security headers without a clear failure signal.
// ---------------------------------------------------------------------------
{
  const bad = ["middleware.ts", "middleware.js", "src/middleware.ts"]
  const found = bad.filter((f) => existsSync(join(ROOT, f)))
  if (found.length) {
    fail(
      "no-legacy-middleware",
      `Found ${found.join(", ")}. Next 16 uses proxy.ts for middleware. Move logic into proxy.ts and delete the file above.`,
    )
  } else {
    pass("no-legacy-middleware", "Next 16 proxy.ts is the only middleware entrypoint")
  }
}

// ---------------------------------------------------------------------------
// 3. No localStorage / sessionStorage in source. The project deliberately
//    persists nothing client-side. If the rule needs to be broken, add the
//    file path to ALLOWED_STORAGE_FILES below with a comment explaining why.
// ---------------------------------------------------------------------------
const ALLOWED_STORAGE_FILES = new Set([
  // Add escape-hatch paths here. Empty by default.
])

// ---------------------------------------------------------------------------
// 4. No DB / ORM clients pulled in. The project is no-DB, no-auth, no-PII.
//    A surprise import is the loudest signal that someone is bolting on a
//    feature that breaks the whole "static, public, honest" architecture.
// ---------------------------------------------------------------------------
const FORBIDDEN_IMPORTS = [
  "@supabase/supabase-js",
  "@supabase/ssr",
  "@neondatabase/serverless",
  "drizzle-orm",
  "@prisma/client",
  "mongodb",
  "mongoose",
  "@upstash/redis",
  "ioredis",
  "redis",
  "pg",
  "mysql",
  "mysql2",
]

function listSourceFiles() {
  // Use git so we only check tracked files. Avoids walking node_modules /
  // .next and respects .gitignore.
  const out = execSync("git ls-files", { encoding: "utf8" })
  return out
    .split("\n")
    .filter(Boolean)
    .filter((p) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(p))
    .filter((p) => !p.startsWith("scripts/"))
    .filter((p) => !p.startsWith("node_modules/"))
}

{
  const files = listSourceFiles()
  const storageHits = []
  const importHits = []
  for (const file of files) {
    let body
    try {
      body = readFileSync(join(ROOT, file), "utf8")
    } catch {
      continue
    }
    // 3. Storage check
    if (
      !ALLOWED_STORAGE_FILES.has(file) &&
      /\b(localStorage|sessionStorage)\b/.test(body)
    ) {
      storageHits.push(file)
    }
    // 4. Forbidden import check
    for (const pkg of FORBIDDEN_IMPORTS) {
      // Match `from "pkg"` or `from "pkg/sub"` or require("pkg")
      const re = new RegExp(
        `(?:from\\s+["']${pkg}(?:/[^"']+)?["']|require\\(\\s*["']${pkg}(?:/[^"']+)?["']\\s*\\))`,
      )
      if (re.test(body)) {
        importHits.push({ file, pkg })
      }
    }
  }

  if (storageHits.length) {
    fail(
      "no-browser-storage",
      [
        "This project does not persist anything client-side.",
        "Found localStorage / sessionStorage references in:",
        ...storageHits.map((f) => `  - ${f}`),
        "If this is intentional, add the path to ALLOWED_STORAGE_FILES in scripts/check-invariants.mjs with a comment.",
      ].join("\n"),
    )
  } else {
    pass("no-browser-storage", "no localStorage/sessionStorage in source")
  }

  if (importHits.length) {
    fail(
      "no-db-clients",
      [
        "This project is intentionally DB-free. Found forbidden imports:",
        ...importHits.map(({ file, pkg }) => `  - ${file} imports ${pkg}`),
        "If a DB has been explicitly added, update scripts/check-invariants.mjs and the README.",
      ].join("\n"),
    )
  } else {
    pass("no-db-clients", "no DB/ORM clients imported")
  }
}

// ---------------------------------------------------------------------------
// 5. proxy.ts must exist and export the security-header proxy. Catches the
//    case where someone deletes proxy.ts thinking it's unused.
// ---------------------------------------------------------------------------
{
  const p = join(ROOT, "proxy.ts")
  if (!existsSync(p)) {
    fail("proxy-present", "proxy.ts is missing — security headers (CSP/HSTS/etc) will not be applied.")
  } else {
    const body = readFileSync(p, "utf8")
    if (!/Content-Security-Policy/.test(body) || !/Strict-Transport-Security/.test(body)) {
      fail(
        "proxy-present",
        "proxy.ts exists but is no longer setting CSP and HSTS headers. Restore them.",
      )
    } else {
      pass("proxy-present", "proxy.ts sets CSP + HSTS")
    }
  }
}

if (failed) {
  console.error(
    "\n[invariants] One or more project invariants were violated. See messages above.",
  )
  process.exit(1)
}
console.log("\n[invariants] all checks passed")
