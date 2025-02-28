'use client'

import React from 'react'
import { trpc } from '../utils/trpc'
import { CartProvider } from '../context/cart-context'
import CustomHeader from './store/components/CustomHeader'
import CartSidebar from './store/components/CartSidebar'
import ProductCard from './store/components/ProductCard'
import './globals.css'

export default function StorePage() {
  const { data: products, isLoading, error } = trpc.products.getAll.useQuery()
  const { data: orders } = trpc.orders.getAll.useQuery()
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null)

  // Get unique categories from products
  const categories = products ? [...new Set(products.map(product => product.category))] : []

  // Filter products by category
  const filteredProducts = categoryFilter ? products?.filter(product => product.category === categoryFilter) : products

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <CustomHeader />
        <CartSidebar />

        <main className="container mx-auto px-4 py-8 flex-grow">
          {/* Hero section */}
          <section className="bg-blue-600 text-white rounded-lg p-8 mb-8">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">Your Orders</h1>

              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="bg-gray-500 p-4 rounded-lg">
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm opacity-80">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      {/* <p className="mt-2">Total: ${order.total.toFixed(2)}</p> */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xl mb-6">You don't have any orders yet.</p>

                  <a
                    href="#products"
                    className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-medium px-6 py-3 rounded-md"
                  >
                    Shop Now
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Products section */}
          <section id="products" className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Products</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCategoryFilter(null)}
                  className={`px-4 py-2 rounded-md ${
                    categoryFilter === null ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 rounded-md ${
                      categoryFilter === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">Error loading products</p>
              </div>
            ) : filteredProducts && filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </section>
        </main>

        <footer className="bg-gray-800 text-white py-6">
          <div className="container mx-auto px-4">
            <p className="text-center">&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </CartProvider>
  )
}
