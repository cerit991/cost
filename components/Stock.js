'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MdAdd, MdLabel, MdAttachMoney } from 'react-icons/md'

const Stock = ({ onAddProduct }) => {
  const [productName, setProductName] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [vatRate, setVatRate] = useState('8') // Default KDV rate

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!productName || !costPrice) return
    
    onAddProduct({
      id: Date.now(),
      name: productName,
      cost: parseFloat(costPrice),
      vatRate: parseInt(vatRate)
    })
    
    setProductName('')
    setCostPrice('')
    setVatRate('8')
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4 bg-gray-50 p-6 rounded-xl"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <MdLabel className="mr-1" /> Ürün Adı
          </label>
          <input
            type="text"
            placeholder="Ürün adını girin"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <MdAttachMoney className="mr-1" /> Birim Fiyat (TL/kg)
          </label>
          <input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            KDV Oranı (%)
          </label>
          <select
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="0">0%</option>
            <option value="1">1%</option>
            <option value="10">10%</option>
            <option value="20">20%</option>
          </select>
        </div>
      </div>
      <motion.button 
        type="submit" 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        <MdAdd size={20} />
        Ürün Ekle
      </motion.button>
    </motion.form>
  )
}

export default Stock