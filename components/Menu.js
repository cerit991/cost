'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdRestaurant, MdShoppingCart, MdSave } from 'react-icons/md'

const Menu = ({ products, onAddMenuItem }) => {
  const [menuName, setMenuName] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('')
  const [totalCost, setTotalCost] = useState(0)
  const [currentUnitCost, setCurrentUnitCost] = useState(0)

  // Calculate current unit cost when product or quantity changes
  useEffect(() => {
    if (selectedProduct && quantity) {
      const product = products.find(p => p.id === parseInt(selectedProduct))
      if (product) {
        const cost = (product.cost / 1000) * parseFloat(quantity)
        setCurrentUnitCost(cost)
      }
    } else {
      setCurrentUnitCost(0)
    }
  }, [selectedProduct, quantity, products])

  // Calculate total cost whenever ingredients change
  useEffect(() => {
    const newTotal = ingredients.reduce((sum, ing) => sum + ing.unitCost, 0)
    setTotalCost(newTotal)
  }, [ingredients])

  // Update ingredient handlers
  const addIngredient = (e) => {
    e.preventDefault()
    if (!selectedProduct || !quantity) return

    const product = products.find(p => p.id === parseInt(selectedProduct))
    setIngredients([...ingredients, {
      product,
      quantity: parseFloat(quantity),
      unitCost: currentUnitCost
    }])
    setSelectedProduct('')
    setQuantity('')
    setCurrentUnitCost(0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!menuName || ingredients.length === 0) return

    onAddMenuItem({
      menuName,
      ingredients,
      totalCost
    })

    setMenuName('')
    setIngredients([])
    setTotalCost(0)
  }

  return (
    <motion.div 
      className="space-y-6 bg-gray-50 p-6 rounded-xl"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <MdRestaurant className="mr-1" /> Menü Adı
        </label>
        <input
          type="text"
          placeholder="Menü adını girin"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <motion.form onSubmit={addIngredient} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="col-span-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Malzeme Seçin</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} - {product.cost} TL/kg
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="number"
              placeholder="Miktar"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {currentUnitCost > 0 && (
              <span className="absolute -bottom-6 left-0 text-sm text-blue-600">
                Maliyet: {currentUnitCost.toFixed(2)} TL
              </span>
            )}
          </div>
          <motion.button 
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
          >
            <MdAdd size={24} />
          </motion.button>
        </div>
      </motion.form>

      {ingredients.length > 0 && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-700">Malzemeler</h3>
            <span className="text-lg font-semibold text-blue-600">
              Toplam: {totalCost.toFixed(2)} TL
            </span>
          </div>
          <div className="space-y-2">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
                <span className="font-medium">{ing.product.name}</span>
                <span className="text-gray-600">
                  {ing.quantity} gr/ml - {ing.unitCost.toFixed(2)} TL
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.button 
        onClick={handleSubmit}
        disabled={!menuName || ingredients.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <MdSave size={20} />
        Menü Oluştur
      </motion.button>
    </motion.div>
  )
}

export default Menu
