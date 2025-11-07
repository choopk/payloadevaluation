import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/client'
import { findWithPagination, findWhere, countDocuments } from '@/lib/payload/operations'

/**
 * GET /api/examples/products
 *
 * Demonstrates various ways to query products using the Payload Local API
 *
 * Query Parameters:
 * - page: Page number for pagination (default: 1)
 * - limit: Items per page (default: 10)
 * - category: Filter by category
 * - inStock: Filter by stock status (true/false)
 * - featured: Filter by featured status (true/false)
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - search: Search term for name/description
 *
 * Examples:
 * - /api/examples/products
 * - /api/examples/products?category=electronics
 * - /api/examples/products?inStock=true&featured=true
 * - /api/examples/products?minPrice=10&maxPrice=100
 * - /api/examples/products?search=laptop
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const inStock = searchParams.get('inStock')
    const featured = searchParams.get('featured')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')

    // Example 1: Simple pagination
    if (!category && !inStock && !featured && !minPrice && !maxPrice && !search) {
      const result = await findWithPagination('products', page, limit)
      return NextResponse.json({
        success: true,
        method: 'Simple Pagination',
        data: result.docs,
        pagination: {
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          totalDocs: result.totalDocs,
        },
      })
    }

    // Example 2: Build complex where query
    const payload = await getPayloadClient()
    const whereConditions: any[] = []

    if (category) {
      whereConditions.push({ category: { equals: category } })
    }

    if (inStock !== null && inStock !== undefined) {
      whereConditions.push({ inStock: { equals: inStock === 'true' } })
    }

    if (featured !== null && featured !== undefined) {
      whereConditions.push({ featured: { equals: featured === 'true' } })
    }

    if (minPrice || maxPrice) {
      const priceCondition: any = {}
      if (minPrice) priceCondition.greater_than_equal = parseFloat(minPrice)
      if (maxPrice) priceCondition.less_than_equal = parseFloat(maxPrice)
      whereConditions.push({ price: priceCondition })
    }

    if (search) {
      // For search, we use OR conditions
      const result = await payload.find({
        collection: 'products',
        where: {
          and: [
            ...whereConditions,
            {
              or: [
                { name: { contains: search } },
                { description: { contains: search } },
              ],
            },
          ],
        },
        page,
        limit,
        sort: '-createdAt',
      })

      return NextResponse.json({
        success: true,
        method: 'Complex Query with Search',
        data: result.docs,
        pagination: {
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          totalDocs: result.totalDocs,
        },
        filters: {
          category,
          inStock,
          featured,
          minPrice,
          maxPrice,
          search,
        },
      })
    }

    // Example 3: Complex AND query
    const result = await payload.find({
      collection: 'products',
      where: {
        and: whereConditions,
      },
      page,
      limit,
      sort: '-createdAt',
    })

    return NextResponse.json({
      success: true,
      method: 'Complex AND Query',
      data: result.docs,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
      },
      filters: {
        category,
        inStock,
        featured,
        minPrice,
        maxPrice,
      },
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/examples/products
 *
 * Creates a new product using the Payload Local API
 *
 * Example body:
 * {
 *   "name": "Awesome Product",
 *   "slug": "awesome-product",
 *   "description": "This is an awesome product",
 *   "price": 99.99,
 *   "category": "electronics",
 *   "inStock": true,
 *   "inventory": 50
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.slug || !body.price || !body.category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: name, slug, price, category',
        },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()

    // Example: Create a new product
    const product = await payload.create({
      collection: 'products',
      data: body,
    })

    return NextResponse.json({
      success: true,
      method: 'Create Document',
      data: product,
    })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create product',
      },
      { status: 500 }
    )
  }
}
