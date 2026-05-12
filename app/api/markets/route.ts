import { NextResponse } from "next/server"
import { getMarketSnapshot } from "@/lib/quidax"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const snapshot = await getMarketSnapshot({ noCache: true })
  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  })
}
