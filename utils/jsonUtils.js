import fs from 'fs'
import path from 'path'

const stockFilePath = path.join(process.cwd(), 'data', 'stock.json')
const menuFilePath = path.join(process.cwd(), 'data', 'menu.json')

export const getStockData = () => {
  try {
    if (!fs.existsSync(stockFilePath)) {
      fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true })
      fs.writeFileSync(stockFilePath, JSON.stringify([]))
      return []
    }
    const data = fs.readFileSync(stockFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading stock data:', error)
    return []
  }
}

export const saveStockData = (data) => {
  try {
    fs.writeFileSync(stockFilePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error saving stock data:', error)
    return false
  }
}

export const getMenuData = () => {
  try {
    if (!fs.existsSync(menuFilePath)) {
      fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true })
      fs.writeFileSync(menuFilePath, JSON.stringify([]))
      return []
    }
    const data = fs.readFileSync(menuFilePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading menu data:', error)
    return []
  }
}

export const saveMenuData = (data) => {
  try {
    fs.writeFileSync(menuFilePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error saving menu data:', error)
    return false
  }
}

export const updateStockData = (productId, updates) => {
  try {
    const data = getStockData()
    const index = data.findIndex(item => item.id === productId)
    if (index !== -1) {
      data[index] = { ...data[index], ...updates }
      saveStockData(data)
      return data[index]
    }
    return null
  } catch (error) {
    console.error('Error updating stock data:', error)
    return null
  }
}

export const updateMenuPrices = (productId, newCost) => {
  try {
    const menus = getMenuData()
    const updatedMenus = menus.map(menu => {
      const updatedIngredients = menu.ingredients.map(ing => {
        if (ing.product.id === productId) {
          const newUnitCost = (newCost / 1000) * ing.quantity
          return { ...ing, product: { ...ing.product, cost: newCost }, unitCost: newUnitCost }
        }
        return ing
      })

      const newTotalCost = updatedIngredients.reduce((sum, ing) => sum + ing.unitCost, 0)
      return { ...menu, ingredients: updatedIngredients, totalCost: newTotalCost }
    })

    saveMenuData(updatedMenus)
    return updatedMenus
  } catch (error) {
    console.error('Error updating menu prices:', error)
    return null
  }
}

export const updateMenuData = (menuId, updates) => {
  try {
    const data = getMenuData()
    const index = data.findIndex(item => item.id === menuId)
    if (index !== -1) {
      data[index] = { ...data[index], ...updates }
      saveMenuData(data)
      return data[index]
    }
    return null
  } catch (error) {
    console.error('Error updating menu data:', error)
    return null
  }
}

export const deleteStockItem = (productId) => {
  try {
    const data = getStockData()
    const newData = data.filter(item => item.id !== productId)
    saveStockData(newData)
    return true
  } catch (error) {
    console.error('Error deleting stock item:', error)
    return false
  }
}

export const removeProductFromMenus = (productId) => {
  try {
    const menus = getMenuData()
    const updatedMenus = menus.map(menu => ({
      ...menu,
      ingredients: menu.ingredients.filter(ing => ing.product.id !== productId),
    })).filter(menu => menu.ingredients.length > 0) // Remove empty menus
    
    saveMenuData(updatedMenus)
    return true
  } catch (error) {
    console.error('Error updating menus after product deletion:', error)
    return false
  }
}
