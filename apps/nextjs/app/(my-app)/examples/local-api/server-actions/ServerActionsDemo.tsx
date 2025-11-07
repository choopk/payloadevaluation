'use client'

import { useState } from 'react'
import {
  createPost,
  deletePost,
  togglePostStatus,
  togglePostFeatured,
  updatePostReadTime,
} from './actions'

export function ServerActionsDemo({ initialPosts }: { initialPosts: any[] }) {
  const [isCreating, setIsCreating] = useState(false)
  const [actionResult, setActionResult] = useState<{
    success: boolean
    message?: string
    error?: string
  } | null>(null)

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsCreating(true)
    setActionResult(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      author: formData.get('author') as string,
      category: formData.get('category') as string,
      status: formData.get('status') as string,
      featured: formData.get('featured') === 'on',
      readTime: parseInt(formData.get('readTime') as string) || undefined,
      publishedDate: formData.get('publishedDate') as string || undefined,
    }

    const result = await createPost(data)
    setActionResult(result)
    setIsCreating(false)

    if (result.success) {
      ;(e.target as HTMLFormElement).reset()
    }
  }

  const handleToggleStatus = async (id: string) => {
    const result = await togglePostStatus(id)
    setActionResult(result)
  }

  const handleToggleFeatured = async (id: string) => {
    const result = await togglePostFeatured(id)
    setActionResult(result)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }
    const result = await deletePost(id)
    setActionResult(result)
  }

  const handleUpdateReadTime = async (id: string, readTime: number) => {
    const result = await updatePostReadTime(id, readTime)
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

      {/* Create Post Form */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Create New Blog Post</h2>
        <form onSubmit={handleCreatePost} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Post Title *
              </label>
              <input
                type="text"
                name="title"
                required
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., Getting Started with Next.js"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                name="slug"
                required
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., getting-started-nextjs"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Excerpt *</label>
            <textarea
              name="excerpt"
              required
              className="w-full border rounded px-3 py-2"
              rows={2}
              placeholder="Brief description of the post..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content *</label>
            <textarea
              name="content"
              required
              className="w-full border rounded px-3 py-2"
              rows={6}
              placeholder="Post content..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Author *</label>
              <input
                type="text"
                name="author"
                required
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select name="category" required className="w-full border rounded px-3 py-2">
                <option value="">Select category</option>
                <option value="technology">Technology</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="travel">Travel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Read Time (min)</label>
              <input
                type="number"
                name="readTime"
                min="1"
                className="w-full border rounded px-3 py-2"
                placeholder="5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <select name="status" required defaultValue="draft" className="w-full border rounded px-3 py-2">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Published Date</label>
              <input
                type="date"
                name="publishedDate"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="featured" />
              <span className="text-sm">Featured Post</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isCreating ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </section>

      {/* Posts List */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Manage Blog Posts</h2>
        {initialPosts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded">
            <p className="text-gray-500 mb-4">
              No posts found. Create your first blog post above!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {initialPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleStatus={handleToggleStatus}
                onToggleFeatured={handleToggleFeatured}
                onDelete={handleDelete}
                onUpdateReadTime={handleUpdateReadTime}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function PostCard({
  post,
  onToggleStatus,
  onToggleFeatured,
  onDelete,
  onUpdateReadTime,
}: {
  post: any
  onToggleStatus: (id: string) => void
  onToggleFeatured: (id: string) => void
  onDelete: (id: string) => void
  onUpdateReadTime: (id: string, readTime: number) => void
}) {
  const [readTime, setReadTime] = useState(post.readTime || 1)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleReadTimeUpdate = async () => {
    setIsUpdating(true)
    await onUpdateReadTime(post.id, readTime)
    setIsUpdating(false)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-lg">{post.title}</h3>
            {post.featured && (
              <span className="px-2 py-1 text-xs bg-yellow-400 text-black rounded">
                ⭐ Featured
              </span>
            )}
            <span className={`px-2 py-1 text-xs rounded ${
              post.status === 'published'
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700'
            }`}>
              {post.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
            <span>👤 {post.author}</span>
            <span className="capitalize">{post.category?.replace('-', ' ')}</span>
            {post.publishedDate && (
              <span>📅 {formatDate(post.publishedDate)}</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Read Time:</label>
              <input
                type="number"
                value={readTime}
                onChange={(e) => setReadTime(parseInt(e.target.value) || 1)}
                className="w-16 border rounded px-2 py-1 text-sm"
                min="1"
              />
              <span className="text-sm text-gray-600">min</span>
              <button
                onClick={handleReadTimeUpdate}
                disabled={isUpdating || readTime === post.readTime}
                className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 disabled:bg-gray-300"
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={() => onToggleStatus(post.id)}
            className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 whitespace-nowrap"
          >
            {post.status === 'published' ? 'Unpublish' : 'Publish'}
          </button>
          <button
            onClick={() => onToggleFeatured(post.id)}
            className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 whitespace-nowrap"
          >
            {post.featured ? 'Unfeature' : 'Feature'}
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
