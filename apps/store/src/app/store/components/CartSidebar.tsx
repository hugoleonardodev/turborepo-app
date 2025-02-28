'use client'

import React, { useState } from 'react'
import { useCart } from '../../../context/cart-context'
import { trpc } from '../../../utils/trpc'

// Cart sidebar component to display cart items and checkout
export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
  })
  const { items, updateQuantity, removeItem, totalItems, totalPrice, clearCart } = useCart()

  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: () => {
      clearCart()
      setIsCheckingOut(false)
      alert('Order placed successfully!')
    },
    onError: error => {
      alert(`Error placing order: ${error.message}`)
    },
  })

  const handleCheckout = () => {
    if (!items.length) return
    setIsCheckingOut(true)
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (items.length === 0) return

    createOrderMutation.mutate({
      products: items,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <>
      {/* Cart button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Cart sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <button
              onClick={() => {
                setIsOpen(false)
                setIsCheckingOut(false)
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : isCheckingOut ? (
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <h3 className="text-lg font-medium">Checkout</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                  <input
                    type="text"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    required
                  />
                </div>
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold mb-2">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
                    disabled={createOrderMutation.isPending}
                  >
                    {createOrderMutation.isPending ? 'Processing...' : 'Place Order'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-md"
                  >
                    Back to Cart
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-md w-8 h-8 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 rounded-md w-8 h-8 flex items-center justify-center"
                      >
                        +
                      </button>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 ml-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isCheckingOut && items.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Subtotal:</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
              >
                Checkout
              </button>
              <button
                onClick={clearCart}
                className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-md"
              >
                Clear Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
