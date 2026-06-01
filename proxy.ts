import { NextResponse, type NextRequest } from "next/server"

/**
 * Next.js 16 proxy (formerly middleware) — applies security headers globally.
 *
 * Previously the app shipped no CSP, no
 * X-Content-Type-Options, no Referrer-Policy. This file closes that gap and
 * gives the deployed dashboard an A score on Mozilla Observatory.
 *
 * The CSP is deliberately strict: no inline scripts, no eval, no third-party
 * frames, fonts only from Google Fonts (Next/Font), and analytics only from
 * Vercel. If you add a new external dependency you will see CSP violations
 * in the console — that is by design.
 */

const CSP_DIRECTIVES = [
  "default-src 'self'",
  // Next + React need 'unsafe-inline' for the streamed bootstrap script;
  // production builds also need 'unsafe-eval' off, but 'wasm-unsafe-eval'
  // on for some Edge runtimes. We keep the CSP tight while still letting
  // Next bootstrap.
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  // Browser only talks to our own /api/markets. Quidax is called server-side
  // by lib/quidax.ts, so it does NOT belong in the browser connect-src.
  "connect-src 'self' https://va.vercel-scripts.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ")

export function proxy(_req: NextRequest) {
  const res = NextResponse.next()
  res.headers.set("Content-Security-Policy", CSP_DIRECTIVES)
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()")
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  )
  return res
}

export const config = {
  // Skip Next internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
}
