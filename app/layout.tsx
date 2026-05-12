import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "NGN Liquidity Intelligence — A B2B Growth Thesis for Quidax",
  description:
    "An independent competitive market analysis of Nigeria's crypto liquidity, stablecoin demand, and the B2B opportunity for Quidax-as-a-Service. Built by Oluwafolajinmi David Aboderin.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#1A0E2E",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
