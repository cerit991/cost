'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiSearch } from 'react-icons/bi'
import Menu from './Menu'

const MenuList = ({ products }) => {
  const [menuItems, setMenuItems] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

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

  const filteredMenuItems = menuItems.filter(item =>
    item.menuName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
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
            {filteredMenuItems.map((item, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="border p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold">{item.menuName}</h3>
                <div className="space-y-1">
                  {item.ingredients.map((ing, idx) => (
                    <p key={idx}>
                      {ing.product.name} - {ing.quantity} gr/ml - 
                      {ing.unitCost.toFixed(2)} TL
                    </p>
                  ))}
                  <p className="font-semibold mt-2 text-blue-600">
                    Toplam Maliyet: {item.totalCost.toFixed(2)} TL
                  </p>
                </div>
              </motion.div>
            ))}
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
    </div>
  )
}

export default MenuList