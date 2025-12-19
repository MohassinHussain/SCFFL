import { NextResponse } from 'next/server'

export async function GET() {
  const products = ["Rice", "Wheat", "Tomato"]
  return NextResponse.json({ products })
}