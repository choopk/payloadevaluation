'use server'

import { getPayloadClient } from '@/lib/payload/client'
import { revalidatePath } from 'next/cache'

/**
 * Server Actions for Blog Post Management
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
 * Create a new blog post
 *
 * @example
 * ```tsx
 * const result = await createPost({
 *   title: 'Getting Started with Next.js',
 *   slug: 'getting-started-nextjs',
 *   content: 'Post content...',
 *   excerpt: 'Learn Next.js basics',
 *   author: 'John Doe',
 *   category: 'technology',
 *   status: 'draft'
 * })
 * ```
 */
export async function createPost(formData: {
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  category: string
  status?: string
  featured?: boolean
  publishedDate?: string
  readTime?: number
  tags?: Array<{ tag: string }>
}): Promise<ActionResult> {
  try {
    // Validate required fields
    if (!formData.title || !formData.slug || !formData.content || !formData.excerpt || !formData.author || !formData.category) {
      return {
        success: false,
        error: 'Missing required fields: title, slug, content, excerpt, author, category',
      }
    }

    const payload = await getPayloadClient()

    // Create the post
    const post = await payload.create({
      collection: 'posts',
      data: formData,
    })

    // Revalidate the examples page to show the new post
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: 'Post created successfully',
      data: post,
    }
  } catch (error: any) {
    console.error('Error creating post:', error)
    return {
      success: false,
      error: error.message || 'Failed to create post',
    }
  }
}

/**
 * Update an existing blog post
 *
 * @example
 * ```tsx
 * const result = await updatePost('123', {
 *   title: 'Updated Title',
 *   status: 'published'
 * })
 * ```
 */
export async function updatePost(
  id: string,
  formData: Partial<{
    title: string
    slug: string
    content: string
    excerpt: string
    author: string
    category: string
    status: string
    featured: boolean
    publishedDate: string
    readTime: number
    tags: Array<{ tag: string }>
  }>
): Promise<ActionResult> {
  try {
    const payload = await getPayloadClient()

    // Update the post
    const post = await payload.update({
      collection: 'posts',
      id,
      data: formData,
    })

    // Revalidate the examples pages
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: 'Post updated successfully',
      data: post,
    }
  } catch (error: any) {
    console.error('Error updating post:', error)
    return {
      success: false,
      error: error.message || 'Failed to update post',
    }
  }
}

/**
 * Delete a blog post
 *
 * @example
 * ```tsx
 * const result = await deletePost('123')
 * ```
 */
export async function deletePost(id: string): Promise<ActionResult> {
  try {
    const payload = await getPayloadClient()

    // Delete the post
    await payload.delete({
      collection: 'posts',
      id,
    })

    // Revalidate the examples pages
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: 'Post deleted successfully',
    }
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete post',
    }
  }
}

/**
 * Toggle post status (draft/published)
 *
 * @example
 * ```tsx
 * const result = await togglePostStatus('123')
 * ```
 */
export async function togglePostStatus(id: string): Promise<ActionResult> {
  try {
    const payload = await getPayloadClient()

    // Get current post
    const post = await payload.findByID({
      collection: 'posts',
      id,
    })

    // Toggle status
    const newStatus = post.status === 'published' ? 'draft' : 'published'
    const updatedPost = await payload.update({
      collection: 'posts',
      id,
      data: {
        status: newStatus,
        // If publishing, set publishedDate if not already set
        ...(newStatus === 'published' && !post.publishedDate
          ? { publishedDate: new Date().toISOString() }
          : {}),
      },
    })

    // Revalidate the examples pages
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: `Post is now ${updatedPost.status}`,
      data: updatedPost,
    }
  } catch (error: any) {
    console.error('Error toggling post status:', error)
    return {
      success: false,
      error: error.message || 'Failed to toggle post status',
    }
  }
}

/**
 * Toggle post featured status
 *
 * @example
 * ```tsx
 * const result = await togglePostFeatured('123')
 * ```
 */
export async function togglePostFeatured(id: string): Promise<ActionResult> {
  try {
    const payload = await getPayloadClient()

    // Get current post
    const post = await payload.findByID({
      collection: 'posts',
      id,
    })

    // Toggle featured status
    const updatedPost = await payload.update({
      collection: 'posts',
      id,
      data: {
        featured: !post.featured,
      },
    })

    // Revalidate the examples pages
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: `Post is now ${updatedPost.featured ? 'featured' : 'not featured'}`,
      data: updatedPost,
    }
  } catch (error: any) {
    console.error('Error toggling post featured:', error)
    return {
      success: false,
      error: error.message || 'Failed to toggle post featured status',
    }
  }
}

/**
 * Update post read time
 *
 * @example
 * ```tsx
 * const result = await updatePostReadTime('123', 5)
 * ```
 */
export async function updatePostReadTime(
  id: string,
  readTime: number
): Promise<ActionResult> {
  try {
    if (readTime < 1) {
      return {
        success: false,
        error: 'Read time must be at least 1 minute',
      }
    }

    const payload = await getPayloadClient()

    // Update read time
    const post = await payload.update({
      collection: 'posts',
      id,
      data: {
        readTime,
      },
    })

    // Revalidate the examples pages
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: 'Read time updated successfully',
      data: post,
    }
  } catch (error: any) {
    console.error('Error updating read time:', error)
    return {
      success: false,
      error: error.message || 'Failed to update read time',
    }
  }
}

/**
 * Bulk update posts
 *
 * @example
 * ```tsx
 * const result = await bulkUpdatePosts(
 *   ['123', '456'],
 *   { category: 'technology', featured: true }
 * )
 * ```
 */
export async function bulkUpdatePosts(
  ids: string[],
  updates: Partial<{
    category: string
    featured: boolean
    status: string
  }>
): Promise<ActionResult> {
  try {
    const payload = await getPayloadClient()
    const results = []

    for (const id of ids) {
      const post = await payload.update({
        collection: 'posts',
        id,
        data: updates,
      })
      results.push(post)
    }

    // Revalidate the examples pages
    revalidatePath('/examples/local-api')
    revalidatePath('/examples/local-api/server-actions')

    return {
      success: true,
      message: `${results.length} posts updated successfully`,
      data: results,
    }
  } catch (error: any) {
    console.error('Error bulk updating posts:', error)
    return {
      success: false,
      error: error.message || 'Failed to bulk update posts',
    }
  }
}
