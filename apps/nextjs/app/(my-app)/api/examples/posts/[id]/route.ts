import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/client'

/**
 * GET /api/examples/posts/[id]
 *
 * Fetches a single blog post by ID using the Payload Local API
 *
 * Example: /api/examples/posts/123
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const payload = await getPayloadClient()

    // Example: Find by ID
    const post = await payload.findByID({
      collection: 'posts',
      id,
    })

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Post not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      method: 'Find by ID',
      data: post,
    })
  } catch (error: any) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch post',
      },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/examples/posts/[id]
 *
 * Updates a blog post by ID using the Payload Local API
 *
 * Example body:
 * {
 *   "title": "Updated Title",
 *   "status": "published"
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
    const post = await payload.update({
      collection: 'posts',
      id,
      data: body,
    })

    return NextResponse.json({
      success: true,
      method: 'Update by ID',
      data: post,
    })
  } catch (error: any) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update post',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/examples/posts/[id]
 *
 * Deletes a blog post by ID using the Payload Local API
 *
 * Example: DELETE /api/examples/posts/123
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
      collection: 'posts',
      id,
    })

    return NextResponse.json({
      success: true,
      method: 'Delete by ID',
      message: 'Post deleted successfully',
    })
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete post',
      },
      { status: 500 }
    )
  }
}
