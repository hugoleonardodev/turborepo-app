'use client'

import React, { ReactNode } from 'react'

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: { id: number; name: string; price: number }) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = React.createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([])

  const addItem = React.useCallback((product: { id: number; name: string; price: number }) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)

      if (existingItem) {
        return prevItems.map(item => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }

      return [...prevItems, { ...product, quantity: 1 }]
    })
  }, [])

  const removeItem = React.useCallback((id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id))
  }, [])

  const updateQuantity = React.useCallback(
    (id: number, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id)
        return
      }

      setItems(prevItems => prevItems.map(item => (item.id === id ? { ...item, quantity } : item)))
    },
    [removeItem],
  )

  const clearCart = React.useCallback(() => {
    setItems([])
  }, [])

  const totalItems = React.useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items])

  const totalPrice = React.useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = React.useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
