import { getPayloadClient } from '@/lib/payload/client'
import { findWhere, countDocuments } from '@/lib/payload/operations'
import Link from 'next/link'

/**
 * Local API Examples - Server Component
 *
 * This page demonstrates various ways to use the Payload Local API
 * in Next.js Server Components. All data is fetched server-side,
 * providing optimal performance and SEO.
 */
export default async function LocalAPIExamplesPage() {
  // Example 1: Get all posts
  const payload = await getPayloadClient()
  const allPosts = await payload.find({
    collection: 'posts',
    limit: 10,
    sort: '-publishedDate',
  })

  // Example 2: Get featured posts using helper
  const featuredPosts = await findWhere('posts', {
    featured: { equals: true },
  })

  // Example 3: Get published posts by category
  const technologyPosts = await findWhere('posts', {
    and: [
      { category: { equals: 'technology' } },
      { status: { equals: 'published' } },
    ],
  })

  // Example 4: Count total posts
  const totalPosts = await countDocuments('posts')

  // Example 5: Count published posts
  const publishedCount = await countDocuments('posts', {
    status: { equals: 'published' },
  })

  // Example 6: Complex query - featured technology posts
  const featuredTechPosts = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { category: { equals: 'technology' } },
        { featured: { equals: true } },
        { status: { equals: 'published' } },
      ],
    },
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Payload Local API Examples</h1>

      <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm text-blue-700">
          This page demonstrates server-side data fetching using the Payload Local API.
          All examples run in Next.js Server Components for optimal performance.
        </p>
      </div>

      {/* Example 1: All Posts */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Example 1: All Posts (Latest 10)
        </h2>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <code className="text-sm">
            {`const allPosts = await payload.find({
  collection: 'posts',
  limit: 10,
  sort: '-publishedDate',
})`}
          </code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allPosts.docs.length > 0 ? (
            allPosts.docs.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No posts found. Create some posts in the admin panel to see them here.
            </p>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Total: {allPosts.totalDocs} posts | Page {allPosts.page} of{' '}
          {allPosts.totalPages}
        </div>
      </section>

      {/* Example 2: Featured Posts */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Example 2: Featured Posts</h2>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <code className="text-sm">
            {`const featuredPosts = await findWhere('posts', {
  featured: { equals: true },
})`}
          </code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredPosts.length > 0 ? (
            featuredPosts.map((post: any) => (
              <PostCard key={post.id} post={post} featured />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No featured posts found.
            </p>
          )}
        </div>
      </section>

      {/* Example 3: Posts by Category */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Example 3: Technology Category (Published)
        </h2>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <code className="text-sm">
            {`const technologyPosts = await findWhere('posts', {
  and: [
    { category: { equals: 'technology' } },
    { status: { equals: 'published' } },
  ],
})`}
          </code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologyPosts.length > 0 ? (
            technologyPosts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No technology posts found.
            </p>
          )}
        </div>
      </section>

      {/* Example 4: Statistics */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Example 4: Statistics</h2>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <code className="text-sm">
            {`const totalPosts = await countDocuments('posts')
const publishedCount = await countDocuments('posts', {
  status: { equals: 'published' },
})`}
          </code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Posts"
            value={totalPosts}
            icon="📝"
          />
          <StatCard
            title="Published"
            value={publishedCount}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Drafts"
            value={totalPosts - publishedCount}
            icon="📄"
            color="orange"
          />
        </div>
      </section>

      {/* Example 5: Complex Query */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Example 5: Complex Query (Featured Technology Posts)
        </h2>
        <div className="bg-gray-50 p-4 rounded mb-4 overflow-x-auto">
          <code className="text-sm whitespace-pre">
            {`const posts = await payload.find({
  collection: 'posts',
  where: {
    and: [
      { category: { equals: 'technology' } },
      { featured: { equals: true } },
      { status: { equals: 'published' } },
    ],
  },
})`}
          </code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTechPosts.docs.length > 0 ? (
            featuredTechPosts.docs.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No posts matching these criteria.
            </p>
          )}
        </div>
      </section>

      {/* Links to other examples */}
      <section className="mt-12 p-6 bg-gray-50 rounded">
        <h2 className="text-2xl font-bold mb-4">More Examples</h2>
        <div className="space-y-2">
          <Link
            href="/examples/local-api/server-actions"
            className="block text-blue-600 hover:underline"
          >
            → Server Actions Example
          </Link>
          <Link
            href="/api/examples/posts"
            className="block text-blue-600 hover:underline"
            target="_blank"
          >
            → API Routes Example (GET /api/examples/posts)
          </Link>
          <a
            href="https://payloadcms.com/docs/local-api/overview"
            className="block text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            → Payload Local API Documentation
          </a>
        </div>
      </section>
    </div>
  )
}

// Post Card Component
function PostCard({ post, featured }: { post: any; featured?: boolean }) {
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
      {featured && (
        <span className="inline-block px-2 py-1 text-xs bg-yellow-400 text-black rounded mb-2">
          ⭐ Featured
        </span>
      )}
      <h3 className="font-bold text-lg mb-2 line-clamp-2">{post.title}</h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-3">
        {post.excerpt}
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <span className="capitalize">{post.category?.replace('-', ' ')}</span>
        <span>•</span>
        <span>{post.author}</span>
      </div>
      {post.readTime && (
        <p className="text-sm text-gray-500 mb-2">📖 {post.readTime} min read</p>
      )}
      <div className="flex items-center justify-between text-sm mt-2">
        <span className={post.status === 'published' ? 'text-green-600' : 'text-orange-600'}>
          {post.status === 'published' ? '✅ Published' : '📄 Draft'}
        </span>
        {post.publishedDate && (
          <span className="text-gray-500">{formatDate(post.publishedDate)}</span>
        )}
      </div>
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {post.tags.slice(0, 3).map((tagObj: any, idx: number) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
            >
              #{tagObj.tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color = 'blue',
}: {
  title: string
  value: number
  icon: string
  color?: string
}) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
  }

  return (
    <div className={`border rounded-lg p-6 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-600">{title}</div>
    </div>
  )
}
