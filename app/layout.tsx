import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LoadingScreen } from "@/components/dashboard/loading-screen"
import { ShapeBackground } from "@/components/ui/shape-background"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const SITE_TITLE = "NGN Liquidity Intelligence — A B2B Look at Quidax"
const SITE_DESCRIPTION =
  "An outside-in look at where Nigeria's crypto money actually moves, how Quidax stacks up against Yellow Card, Busha, Luno, and Roqqu, and what selling Quidax-as-a-Service to other businesses could be worth. Public data only. Not affiliated with Quidax Technologies Limited."

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://quidax-dashboard.vercel.app",
  ),
  title: {
    default: SITE_TITLE,
    template: "%s · NGN Liquidity Intelligence",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Quidax",
    "Nigeria",
    "stablecoin",
    "USDT/NGN",
    "cNGN",
    "B2B crypto",
    "fintech",
    "remittance corridors",
    "NFEM",
    "NGN liquidity",
  ],
  authors: [{ name: "Oluwafolajinmi David Aboderin" }],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#1A0E2E",
  width: "device-width",
  initialScale: 1,
}

const showAnalytics =
  process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === "preview"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} bg-background`}
    >
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <LoadingScreen />
        <ShapeBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
        {showAnalytics && <Analytics />}
      </body>
    </html>
  )
}
