import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "NGN Liquidity Intelligence — independent B2B market analysis"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * Open Graph image generated at the edge.
 *
 * Audit fix [3]/[Low]: previously the link unfurled with no preview,
 * which is a missed first impression on LinkedIn / Slack.
 */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "linear-gradient(135deg, #160F26 0%, #2A1645 45%, #4A1E6E 100%)",
          color: "#F5F0FF",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #9747FF, #C44CFF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            Q
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 18,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#C9B8E0",
            }}
          >
            <span>NGN Liquidity Intelligence</span>
            <span style={{ fontSize: 14, color: "#8B7AA8" }}>
              Independent analysis · public data only
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            Nigeria&apos;s next billion of crypto flow is{" "}
            <span style={{ color: "#C97AFF" }}>B2B</span>, not retail.
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#A89BC0",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Quantifying the stablecoin liquidity gap, benchmarking
            exchange-as-a-service rails, and sizing four B2B segments.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 18,
            color: "#8B7AA8",
            borderTop: "1px solid #3A2B5C",
            paddingTop: 24,
          }}
        >
          <span>by Oluwafolajinmi David Aboderin</span>
          <span style={{ fontFamily: "monospace", letterSpacing: 1 }}>
            ngn-liquidity-intelligence.vercel.app
          </span>
        </div>
      </div>
    ),
    size,
  )
}
