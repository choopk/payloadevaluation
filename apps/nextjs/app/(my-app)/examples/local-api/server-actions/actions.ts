'use server'

import { getPayloadClient } from '@/lib/payload/client'
import { revalidatePath } from 'next/cache'

/**
 * Server Actions for Product Management
 *
 * These server actions demonstrate how to use the Payload Local API
 * for mutations in Next.js. All actions are server-side and can be
 * called directly from client components.
 */

export type ActionResult = {
  success: boolean
  message?: string
  error?: string
  data?: any
}

/**
 * Create a new product
 *
 * @example
 * ```tsx
 * const result = await createProduct({
 *   name: 'New Product',
 *   slug: 'new-product',
 *   price: 99.99,
 *   category: 'electronics',
 *   inStock: true
 * })
 * ```
 */
export async function createProduct(formData: {
  name: string
  slug: string
  description?: string
  price: number
  category: string
  inStock?: boolean
  featured?: boolean
  inventory?: number
}): Promise<ActionResult> {
  try {
    // Validate required fields
    if (!formData.name || !formData.slug || !formData.price || !formData.category) {
      return {
        success: false,
        error: 'Missing required fields: name, slug, price, category',
      }
    }

    const payload = await getPayloadClient()

    // Create the product
    const product = await payload.create({
      collection: 'products',
      data: formData,
    })

    // Revalidate the examples page to show the new product
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: 'Product created successfully',
      data: product,
    }
  } catch (error: any) {
    console.error('Error creating product:', error)
    return {
      success: false,
      error: error.message || 'Failed to create product',
    }
  }
}

/**
 * Update an existing product
 *
 * @example
 * ```tsx
 * const result = await updateProduct('123', {
 *   price: 79.99,
 *   inStock: false
 * })
 * ```
 */
export async function updateProduct(
  id: string,
  formData: Partial<{
    name: string
    slug: string
    description: string
    price: number
    category: string
    inStock: boolean
    featured: boolean
    inventory: number
  }>
): Promise<ActionResult> {
  try {
    const payload = await getPayloadClient()

    // Update the product
    const product = await payload.update({
      collection: 'products',
      id,
      data: formData,
    })

    // Revalidate the examples pages
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: 'Product updated successfully',
      data: product,
    }
  } catch (error: any) {
    console.error('Error updating product:', error)
    return {
      success: false,
      error: error.message || 'Failed to update product',
    }
  }
}

/**
 * Delete a product
 *
 * @example
 * ```tsx
 * const result = await deleteProduct('123')
 * ```
 */
export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    const payload = await getPayloadClient()

    // Delete the product
    await payload.delete({
      collection: 'products',
      id,
    })

    // Revalidate the examples pages
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete product',
    }
  }
}

/**
 * Toggle product stock status
 *
 * @example
 * ```tsx
 * const result = await toggleProductStock('123')
 * ```
 */
export async function toggleProductStock(id: string): Promise<ActionResult> {
  try {
    const payload = await getPayloadClient()

    // Get current product
    const product = await payload.findByID({
      collection: 'products',
      id,
    })

    // Toggle inStock status
    const updatedProduct = await payload.update({
      collection: 'products',
      id,
      data: {
        inStock: !product.inStock,
      },
    })

    // Revalidate the examples pages
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: `Product is now ${updatedProduct.inStock ? 'in stock' : 'out of stock'}`,
      data: updatedProduct,
    }
  } catch (error: any) {
    console.error('Error toggling product stock:', error)
    return {
      success: false,
      error: error.message || 'Failed to toggle product stock',
    }
  }
}

/**
 * Toggle product featured status
 *
 * @example
 * ```tsx
 * const result = await toggleProductFeatured('123')
 * ```
 */
export async function toggleProductFeatured(id: string): Promise<ActionResult> {
  try {
    const payload = await getPayloadClient()

    // Get current product
    const product = await payload.findByID({
      collection: 'products',
      id,
    })

    // Toggle featured status
    const updatedProduct = await payload.update({
      collection: 'products',
      id,
      data: {
        featured: !product.featured,
      },
    })

    // Revalidate the examples pages
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: `Product is now ${updatedProduct.featured ? 'featured' : 'not featured'}`,
      data: updatedProduct,
    }
  } catch (error: any) {
    console.error('Error toggling product featured:', error)
    return {
      success: false,
      error: error.message || 'Failed to toggle product featured status',
    }
  }
}

/**
 * Update product inventory
 *
 * @example
 * ```tsx
 * const result = await updateProductInventory('123', 50)
 * ```
 */
export async function updateProductInventory(
  id: string,
  inventory: number
): Promise<ActionResult> {
  try {
    if (inventory < 0) {
      return {
        success: false,
        error: 'Inventory cannot be negative',
      }
    }

    const payload = await getPayloadClient()

    // Update inventory
    const product = await payload.update({
      collection: 'products',
      id,
      data: {
        inventory,
        inStock: inventory > 0,
      },
    })

    // Revalidate the examples pages
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: 'Inventory updated successfully',
      data: product,
    }
  } catch (error: any) {
    console.error('Error updating inventory:', error)
    return {
      success: false,
      error: error.message || 'Failed to update inventory',
    }
  }
}

/**
 * Bulk update products
 *
 * @example
 * ```tsx
 * const result = await bulkUpdateProducts(
 *   ['123', '456'],
 *   { featured: true }
 * )
 * ```
 */
export async function bulkUpdateProducts(
  ids: string[],
  updates: Partial<{
    category: string
    featured: boolean
    inStock: boolean
  }>
): Promise<ActionResult> {
  try {
    const payload = await getPayloadClient()
    const results = []

    for (const id of ids) {
      const product = await payload.update({
        collection: 'products',
        id,
        data: updates,
      })
      results.push(product)
    }

    // Revalidate the examples pages
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: `${results.length} products updated successfully`,
      data: results,
    }
  } catch (error: any) {
    console.error('Error bulk updating products:', error)
    return {
      success: false,
      error: error.message || 'Failed to bulk update products',
    }
  }
}
