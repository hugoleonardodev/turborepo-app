'use client'

import React from 'react'
import { useCart } from '../../../context/cart-context'

interface Product {
  id: number
  name: string
  category: string
  price: number
  quantity: number
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  const handleAddToCart = React.useCallback(() => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
    })
  }, [addItem, product])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          <span className={`text-sm ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.quantity <= 0}
          className={`w-full py-2 rounded-md text-center text-white font-medium ${
            product.quantity > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}
