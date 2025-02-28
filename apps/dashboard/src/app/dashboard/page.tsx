'use client'

import { useState } from 'react'
import { trpc } from '../../utils/trpc'
import ProductForm from './components/ProductForm'

export default function Dashboard() {
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const utils = trpc.useUtils()
  const { data: products, isLoading } = trpc.products.getAll.useQuery()
  const deleteMutation = trpc.products.delete.useMutation({
    onSuccess: () => {
      utils.products.getAll.invalidate()
    },
  })

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate({ id })
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product)
    setIsAddingProduct(true)
  }

  const handleCloseForm = () => {
    setIsAddingProduct(false)
    setEditingProduct(null)
  }

  const handleFormSuccess = () => {
    utils.products.getAll.invalidate()
    handleCloseForm()
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Management</h1>
        {!isAddingProduct && (
          <button
            onClick={() => setIsAddingProduct(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Add New Product
          </button>
        )}
      </div>

      {isAddingProduct ? (
        <ProductForm existingProduct={editingProduct} onCancel={handleCloseForm} onSuccess={handleFormSuccess} />
      ) : (
        <>
          {isLoading ? (
            <p>Loading products...</p>
          ) : (
            <>
              {products && products.length > 0 ? (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Created
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {products.map(product => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap">${product.price.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap space-x-2">
                            <button
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1 px-3 rounded-md transition-colors"
                              onClick={() => handleEdit(product)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md transition-colors"
                              onClick={() => handleDelete(product.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 bg-white rounded-lg shadow">
                  <p className="text-gray-500 mb-4">No products found</p>
                  <p className="text-sm mb-4">Add your first product to get started</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
