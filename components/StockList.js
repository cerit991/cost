'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BiSearch, BiEdit } from 'react-icons/bi'
import { MdClose, MdSave } from 'react-icons/md'
import Stock from './Stock'

const StockList = ({ products, onAddProduct, onProductUpdate }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [newPrice, setNewPrice] = useState('')

  const updateProductPrice = async (productId, newPrice) => {
    try {
      const response = await fetch('/api/stock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: productId,
          updates: { cost: parseFloat(newPrice) }
        })
      })

      if (response.ok) {
        await onProductUpdate() // Trigger refresh instead of page reload
        setEditingProduct(null)
        setNewPrice('')
      }
    } catch (error) {
      console.error('Error updating price:', error)
    }
  }

  const handleUpdateSubmit = (e) => {
    e.preventDefault()
    if (editingProduct && newPrice) {
      updateProductPrice(editingProduct.id, newPrice)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Stock onAddProduct={onAddProduct} />
      <div className="mt-6">
        <div className="flex items-center space-x-2 mb-4">
          <h2 className="text-xl font-semibold">Ürün Listesi</h2>
          <div className="flex-1 relative">
            <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <motion.input
              initial={{ width: "50%" }}
              whileFocus={{ width: "100%" }}
              transition={{ duration: 0.2 }}
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-1/2 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <motion.div layout className="space-y-2">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="border p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">{product.name}</p>
                  <div className="flex items-center gap-3">
                    <p className="text-blue-600 font-semibold">{product.cost.toFixed(2)} TL/kg</p>
                    <button
                      onClick={() => {
                        setEditingProduct(product)
                        setNewPrice(product.cost.toString())
                      }}
                      className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <BiEdit size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredProducts.length === 0 && searchQuery && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 py-4"
            >
              "{searchQuery}" ile eşleşen ürün bulunamadı
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Update Price Modal */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Fiyat Güncelle</h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <MdClose size={20} />
                </button>
              </div>
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {editingProduct.name} - Yeni Fiyat (TL/kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <MdSave size={20} />
                    Kaydet
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default StockList