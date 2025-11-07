import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/client'

/**
 * GET /api/examples/products/[id]
 *
 * Fetches a single product by ID using the Payload Local API
 *
 * Example: /api/examples/products/123
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayloadClient()

    // Example: Find by ID
    const product = await payload.findByID({
      collection: 'products',
      id,
    })

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      method: 'Find by ID',
      data: product,
    })
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch product',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/examples/products/[id]
 *
 * Updates a product by ID using the Payload Local API
 *
 * Example body:
 * {
 *   "price": 79.99,
 *   "inStock": false
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const payload = await getPayloadClient()

    // Example: Update by ID
    const product = await payload.update({
      collection: 'products',
      id,
      data: body,
    })

    return NextResponse.json({
      success: true,
      method: 'Update by ID',
      data: product,
    })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update product',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/examples/products/[id]
 *
 * Deletes a product by ID using the Payload Local API
 *
 * Example: DELETE /api/examples/products/123
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayloadClient()

    // Example: Delete by ID
    await payload.delete({
      collection: 'products',
      id,
    })

    return NextResponse.json({
      success: true,
      method: 'Delete by ID',
      message: 'Product deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete product',
      },
      { status: 500 }
    )
  }
}
