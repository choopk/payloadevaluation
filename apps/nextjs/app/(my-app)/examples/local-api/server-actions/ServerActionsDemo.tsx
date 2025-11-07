'use client'

import { useState } from 'react'
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStock,
  toggleProductFeatured,
  updateProductInventory,
} from './actions'

export function ServerActionsDemo({ initialProducts }: { initialProducts: any[] }) {
  const [isCreating, setIsCreating] = useState(false)
  const [actionResult, setActionResult] = useState<{
    success: boolean
    message?: string
    error?: string
  } | null>(null)

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreating(true)
    setActionResult(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      inStock: formData.get('inStock') === 'on',
      featured: formData.get('featured') === 'on',
      inventory: parseInt(formData.get('inventory') as string) || 0,
    }

    const result = await createProduct(data)
    setActionResult(result)
    setIsCreating(false)

    if (result.success) {
      ;(e.target as HTMLFormElement).reset()
    }
  }

  const handleToggleStock = async (id: string) => {
    const result = await toggleProductStock(id)
    setActionResult(result)
  }

  const handleToggleFeatured = async (id: string) => {
    const result = await toggleProductFeatured(id)
    setActionResult(result)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }
    const result = await deleteProduct(id)
    setActionResult(result)
  }

  const handleUpdateInventory = async (id: string, inventory: number) => {
    const result = await updateProductInventory(id, inventory)
    setActionResult(result)
  }

  return (
    <div className="space-y-8">
      {/* Action Result Display */}
      {actionResult && (
        <div
          className={`p-4 rounded ${
            actionResult.success
              ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
              : 'bg-red-50 border-l-4 border-red-500 text-red-700'
          }`}
        >
          <p className="font-bold">
            {actionResult.success ? '✅ Success' : '❌ Error'}
          </p>
          <p>{actionResult.message || actionResult.error}</p>
        </div>
      )}

      {/* Create Product Form */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Create New Product</h2>
        <form onSubmit={handleCreateProduct} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., Wireless Headphones"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                name="slug"
                required
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., wireless-headphones"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Product description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                min="0"
                className="w-full border rounded px-3 py-2"
                placeholder="99.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select name="category" required className="w-full border rounded px-3 py-2">
                <option value="">Select category</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="books">Books</option>
                <option value="home-garden">Home & Garden</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Inventory</label>
              <input
                type="number"
                name="inventory"
                min="0"
                defaultValue="0"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="inStock" defaultChecked />
              <span className="text-sm">In Stock</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" />
              <span className="text-sm">Featured</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isCreating ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </section>

      {/* Products List */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
        {initialProducts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded">
            <p className="text-gray-500 mb-4">
              No products found. Create your first product above!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {initialProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleStock={handleToggleStock}
                onToggleFeatured={handleToggleFeatured}
                onDelete={handleDelete}
                onUpdateInventory={handleUpdateInventory}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function ProductCard({
  product,
  onToggleStock,
  onToggleFeatured,
  onDelete,
  onUpdateInventory,
}: {
  product: any
  onToggleStock: (id: string) => void
  onToggleFeatured: (id: string) => void
  onDelete: (id: string) => void
  onUpdateInventory: (id: string, inventory: number) => void
}) {
  const [inventory, setInventory] = useState(product.inventory || 0)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleInventoryUpdate = async () => {
    setIsUpdating(true)
    await onUpdateInventory(product.id, inventory)
    setIsUpdating(false)
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-lg">{product.name}</h3>
            {product.featured && (
              <span className="px-2 py-1 text-xs bg-yellow-400 text-black rounded">
                ⭐ Featured
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-2 capitalize">
            {product.category?.replace('-', ' ')}
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-2">
            ${product.price?.toFixed(2)}
          </p>
          <div className="flex items-center gap-4">
            <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
              {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
            </span>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Inventory:</label>
              <input
                type="number"
                value={inventory}
                onChange={(e) => setInventory(parseInt(e.target.value) || 0)}
                className="w-20 border rounded px-2 py-1 text-sm"
                min="0"
              />
              <button
                onClick={handleInventoryUpdate}
                disabled={isUpdating || inventory === product.inventory}
                className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 disabled:bg-gray-300"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => onToggleStock(product.id)}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Toggle Stock
          </button>
          <button
            onClick={() => onToggleFeatured(product.id)}
            className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
          >
            Toggle Featured
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
