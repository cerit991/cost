import { getStockData, saveStockData, updateStockData, updateMenuPrices, deleteStockItem, removeProductFromMenus } from '@/utils/jsonUtils'
import { NextResponse } from 'next/server'

export async function GET() {
  const data = getStockData()
  return NextResponse.json(data)
}

export async function POST(request) {
  const product = await request.json()
  const currentData = getStockData()
  currentData.push(product)
  saveStockData(currentData)
  return NextResponse.json(product)
}

export async function PUT(request) {
  const { id, updates } = await request.json()
  const updatedProduct = updateStockData(id, updates)
  if (updatedProduct) {
    // Update all menus that use this product
    updateMenuPrices(id, updates.cost)
    return NextResponse.json(updatedProduct)
  }
  return NextResponse.json({ error: 'Product not found' }, { status: 404 })
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url)
  const id = parseInt(searchParams.get('id'))
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 })
  }

  const deleted = deleteStockItem(id)
  if (deleted) {
    // Remove product from all menus
    removeProductFromMenus(id)
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json({ error: 'Product not found' }, { status: 404 })
}
