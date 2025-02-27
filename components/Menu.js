'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdRestaurant, MdSave, MdClose, MdDelete } from 'react-icons/md'
import { BiSearch } from 'react-icons/bi'

const Menu = ({ products, onAddMenuItem, initialMenu = null, onCancel }) => {
  const [menuName, setMenuName] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState('')
  const [totalCost, setTotalCost] = useState(0)
  const [currentUnitCost, setCurrentUnitCost] = useState(0)
  const [productSearch, setProductSearch] = useState('')

  // Load initial menu data if editing
  useEffect(() => {
    if (initialMenu) {
      setMenuName(initialMenu.menuName)
      setIngredients(initialMenu.ingredients)
    }
  }, [initialMenu])

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

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase())
  )

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

  const removeIngredient = (indexToRemove) => {
    setIngredients(ingredients.filter((_, index) => index !== indexToRemove))
  }

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : '0.00'
  }

  const calculateCosts = (ingredients) => {
    const costs = ingredients.reduce((acc, ing) => {
      const baseUnitCost = ing.unitCost || 0
      const vatRate = ing.product.vatRate || 0
      const vatAmount = baseUnitCost * (vatRate / 100)
      return {
        baseTotal: acc.baseTotal + baseUnitCost,
        vatTotal: acc.vatTotal + vatAmount
      }
    }, { baseTotal: 0, vatTotal: 0 })

    return {
      baseCost: costs.baseTotal,
      vatAmount: costs.vatTotal,
      totalCost: costs.baseTotal + costs.vatTotal
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!menuName || ingredients.length === 0) return

    const costs = calculateCosts(ingredients)
    const menuData = {
      ...(initialMenu && { id: initialMenu.id }), // Keep original ID if editing
      menuName,
      ingredients,
      baseCost: costs.baseCost,
      vatAmount: costs.vatAmount,
      totalCost: costs.totalCost
    }
    
    onAddMenuItem(menuData)
    
    // Reset form after successful submission (only if not editing)
    if (!initialMenu) {
      resetForm()
    }
  }

  // New reset function to clear all states
  const resetForm = () => {
    setMenuName('')
    setIngredients([])
    setSelectedProduct('')
    setQuantity('')
    setTotalCost(0)
    setCurrentUnitCost(0)
    setProductSearch('')
  }

  // Update handleCancel to use resetForm
  const handleCancel = () => {
    resetForm()
    onCancel?.()
  }

  return (
    <motion.div 
      className="space-y-6 bg-gray-50 p-6 rounded-xl"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {initialMenu ? 'Menü Düzenle' : 'Yeni Menü Oluştur'}
        </h2>
        {initialMenu && (
          <button
            onClick={handleCancel}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <MdClose size={20} />
          </button>
        )}
      </div>
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
        <div className="col-span-2 space-y-2">
          <div className="relative">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Malzeme ara..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            size={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 overflow-auto"
          >
            <option value="">Malzeme Seçin</option>
            {filteredProducts.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.cost} TL/kg (KDV: %{product.vatRate || 0})
              </option>
            ))}
          </select>
        </div>
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
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium text-gray-700">Malzemeler</h3>
            <div className="space-y-2">
              {ingredients.map((ing, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-all group"
                >
                  <span className="font-medium">{ing.product.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      {ing.quantity} gr/ml - {ing.unitCost.toFixed(2)} TL
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeIngredient(index)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Malzemeyi Sil"
                    >
                      <MdDelete size={20} />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 mt-2">
              <p className="text-gray-600">
                KDV Hariç: {formatPrice(calculateCosts(ingredients).baseCost)} TL
              </p>
              <p className="text-gray-600">
                KDV Tutarı: {formatPrice(calculateCosts(ingredients).vatAmount)} TL
              </p>
              <p className="text-lg font-semibold text-blue-600">
                Toplam (KDV Dahil): {formatPrice(calculateCosts(ingredients).totalCost)} TL
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-2">
        {initialMenu && (
          <motion.button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            İptal
          </motion.button>
        )}
        <motion.button 
          onClick={handleSubmit}
          disabled={!menuName || ingredients.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <MdSave size={20} />
          {initialMenu ? 'Güncelle' : 'Menü Oluştur'}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Menu