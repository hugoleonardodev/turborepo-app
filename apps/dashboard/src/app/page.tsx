'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import './globals.css'

export default function Home() {
  const router = useRouter()

  const handleLogin = React.useCallback(() => {
    // Mock login - in a real application, this would handle authentication
    router.push('/dashboard')
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">E-commerce Dashboard</h1>
        <p className="text-xl mb-8">Manage your products and orders efficiently</p>
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
        >
          Login to Dashboard
        </button>
      </div>
    </main>
  )
}
