'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiSearch, BiEdit } from 'react-icons/bi'
import Menu from './Menu'

const MenuList = ({ products }) => {
  const [menuItems, setMenuItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingMenu, setEditingMenu] = useState(null)

  useEffect(() => {
    fetchMenus()
  }, [])

  useEffect(() => {
    fetchMenus()
  }, [products]) // Refresh when products change

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menu')
      const data = await response.json()
      setMenuItems(data)
    } catch (error) {
      console.error('Error fetching menus:', error)
    } finally {
      setLoading(false)
    }
  }

  const addMenuItem = async (menuItem) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItem)
      })
      
      if (response.ok) {
        const savedMenu = await response.json()
        setMenuItems([...menuItems, savedMenu])
      }
    } catch (error) {
      console.error('Error adding menu:', error)
    }
  }

  const handleEditMenu = (menu) => {
    setEditingMenu(menu)
  }

  const handleUpdateMenu = async (updatedMenu) => {
    try {
      const response = await fetch('/api/menu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMenu)
      })
      
      if (response.ok) {
        await fetchMenus() // Refresh menu list
        setEditingMenu(null)
      }
    } catch (error) {
      console.error('Error updating menu:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingMenu(null)
    // Scroll back to top smoothly when canceling
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00'
  }

  const getIngredientInfo = (ing) => {
    if (!ing || !ing.product) return {
      name: 'Bilinmeyen Ürün',
      quantity: 0,
      unitCost: 0,
      vatRate: 0
    }

    return {
      name: ing.product.name || 'Bilinmeyen Ürün',
      quantity: ing.quantity || 0,
      unitCost: ing.unitCost || 0,
      vatRate: ing.product.vatRate || 0
    }
  }

  const filteredMenuItems = menuItems.filter(item =>
    item.menuName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {!editingMenu ? (
        <>
          <Menu onAddMenuItem={addMenuItem} products={products} />
          
          <div className="mt-6">
            <div className="flex items-center space-x-2 mb-4">
              <h2 className="text-xl font-semibold">Menü Listesi</h2>
              <div className="flex-1 relative">
                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <motion.input
                  initial={{ width: "50%" }}
                  whileFocus={{ width: "100%" }}
                  transition={{ duration: 0.2 }}
                  type="text"
                  placeholder="Menü ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-1/2 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <motion.div layout className="space-y-2">
              <AnimatePresence>
                {filteredMenuItems.map((item, index) => {
                  if (!item) return null;
                  
                  return (
                    <motion.div
                      key={index}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold">{item.menuName || 'İsimsiz Menü'}</h3>
                        <button
                          onClick={() => handleEditMenu(item)}
                          className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <BiEdit size={20} />
                        </button>
                      </div>
                      <div className="space-y-1">
                        {(item.ingredients || []).map((ing, idx) => {
                          const { name, quantity, unitCost, vatRate } = getIngredientInfo(ing);
                          return (
                            <p key={idx}>
                              {name} - {quantity} gr/ml - 
                              {formatPrice(unitCost)} TL
                              <span className="text-gray-500 text-sm">
                                (KDV: %{vatRate})
                              </span>
                            </p>
                          );
                        })}
                        <div className="border-t pt-2 mt-2">
                          <p className="text-gray-600">
                            KDV Hariç: {formatPrice(item.baseCost)} TL
                          </p>
                          <p className="text-gray-600">
                            KDV Tutarı: {formatPrice(item.vatAmount)} TL
                          </p>
                          <p className="font-semibold text-blue-600">
                            Toplam (KDV Dahil): {formatPrice(item.totalCost)} TL
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {filteredMenuItems.length === 0 && searchQuery && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-500 py-4"
                >
                  "{searchQuery}" ile eşleşen menü bulunamadı
                </motion.p>
              )}
            </motion.div>
          </div>
        </>
      ) : (
        <Menu
          onAddMenuItem={handleUpdateMenu}
          products={products}
          initialMenu={editingMenu}
          onCancel={handleCancelEdit}
          key={editingMenu.id} // Add key to force re-render on edit
        />
      )}
    </div>
  );
};

export default MenuList;