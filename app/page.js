'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdInventory, MdRestaurantMenu } from 'react-icons/md'
import { BiSolidFoodMenu } from "react-icons/bi"
import StockList from '@/components/StockList'
import MenuList from '@/components/MenuList'

const Page = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/stock')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product) => {
    try {
      const response = await fetch('/api/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
      })
      
      if (response.ok) {
        setProducts([...products, product])
      }
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  const handleProductUpdate = async () => {
    await fetchProducts()
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <motion.nav 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <BiSolidFoodMenu className="text-blue-600" size={36} />
            Restaurant Maliyet Yönetimi
          </h1>
        </div>
      </motion.nav>
      
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.section 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <MdInventory className="mr-2 text-blue-600" size={24} />
                Ürün Yönetimi
              </h2>
              <StockList 
                products={products} 
                onAddProduct={addProduct} 
                onProductUpdate={handleProductUpdate}
              />
            </motion.section>

            <motion.section 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <MdRestaurantMenu className="mr-2 text-blue-600" size={24} />
                Menü Yönetimi
              </h2>
              <MenuList products={products} />
            </motion.section>
          </div>
        )}
      </main>
    </motion.div>
  )
}

export default Page