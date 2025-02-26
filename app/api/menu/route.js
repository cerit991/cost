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

export async function PUT(request) {
  const menu = await request.json()
  const currentData = getMenuData()
  const index = currentData.findIndex(item => item.id === menu.id)
  
  if (index !== -1) {
    currentData[index] = menu
    saveMenuData(currentData)
    return NextResponse.json(menu)
  }
  
  return NextResponse.json({ error: 'Menu not found' }, { status: 404 })
}
