import { getMenuData, saveMenuData } from '@/utils/jsonUtils'
import { NextResponse } from 'next/server'

export async function GET() {
  const data = getMenuData()
  return NextResponse.json(data)
}

export async function POST(request) {
  const menu = await request.json()
  const currentData = getMenuData()
  menu.id = Date.now() // Add unique id
  currentData.push(menu)
  saveMenuData(currentData)
  return NextResponse.json(menu)
}
