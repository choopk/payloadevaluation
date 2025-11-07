import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/client'
import { findWithPagination } from '@/lib/payload/operations'

/**
 * GET /api/examples/posts
 *
 * Demonstrates various ways to query blog posts using the Payload Local API
 *
 * Query Parameters:
 * - page: Page number for pagination (default: 1)
 * - limit: Items per page (default: 10)
 * - category: Filter by category
 * - status: Filter by status (draft/published)
 * - featured: Filter by featured status (true/false)
 * - author: Filter by author name
 * - tag: Filter by tag
 * - search: Search term for title/excerpt/content
 *
 * Examples:
 * - /api/examples/posts
 * - /api/examples/posts?category=technology
 * - /api/examples/posts?status=published&featured=true
 * - /api/examples/posts?author=John Doe
 * - /api/examples/posts?search=nextjs
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const author = searchParams.get('author')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')

    // Example 1: Simple pagination
    if (!category && !status && !featured && !author && !tag && !search) {
      const result = await findWithPagination('posts', page, limit)
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

    if (status) {
      whereConditions.push({ status: { equals: status } })
    }

    if (featured !== null && featured !== undefined) {
      whereConditions.push({ featured: { equals: featured === 'true' } })
    }

    if (author) {
      whereConditions.push({ author: { contains: author } })
    }

    if (tag) {
      whereConditions.push({ 'tags.tag': { equals: tag } })
    }

    if (search) {
      // For search, we use OR conditions
      const result = await payload.find({
        collection: 'posts',
        where: {
          and: [
            ...whereConditions,
            {
              or: [
                { title: { contains: search } },
                { excerpt: { contains: search } },
                { content: { contains: search } },
              ],
            },
          ],
        },
        page,
        limit,
        sort: '-publishedDate',
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
          status,
          featured,
          author,
          tag,
          search,
        },
      })
    }

    // Example 3: Complex AND query
    const result = await payload.find({
      collection: 'posts',
      where: {
        and: whereConditions,
      },
      page,
      limit,
      sort: '-publishedDate',
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
        status,
        featured,
        author,
        tag,
      },
    })
  } catch (error: any) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch posts',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/examples/posts
 *
 * Creates a new blog post using the Payload Local API
 *
 * Example body:
 * {
 *   "title": "Getting Started with Next.js",
 *   "slug": "getting-started-with-nextjs",
 *   "content": "This is the post content...",
 *   "excerpt": "Learn the basics of Next.js",
 *   "author": "John Doe",
 *   "category": "technology",
 *   "status": "published",
 *   "publishedDate": "2025-01-01"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.slug || !body.content || !body.excerpt || !body.author || !body.category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, slug, content, excerpt, author, category',
        },
        { status: 400 }
      )
    }

    const payload = await getPayloadClient()

    // Example: Create a new post
    const post = await payload.create({
      collection: 'posts',
      data: body,
    })

    return NextResponse.json({
      success: true,
      method: 'Create Document',
      data: post,
    })
  } catch (error: any) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create post',
      },
      { status: 500 }
    )
  }
}
