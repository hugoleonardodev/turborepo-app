import React from 'react'

export default function CustomHeader() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">E-Shop</h1>
        {/* <nav>
          <ul className="flex space-x-6">
            <li>
              <a href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </a>
            </li>
            <li>
              <a href="#products" className="text-gray-600 hover:text-blue-600">
                Products
              </a>
            </li>
          </ul>
        </nav> */}
      </div>
    </header>
  )
}
