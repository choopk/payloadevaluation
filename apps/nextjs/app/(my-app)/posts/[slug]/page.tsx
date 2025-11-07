import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  // Fetch the post - include drafts if in draft mode
  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    draft: isDraftMode,
    limit: 1,
  })

  const post = result.docs[0]

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isDraftMode && (
        <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">Preview Mode</p>
          <p>You are viewing a draft version of this post.</p>
        </div>
      )}

      <article className="prose lg:prose-xl mx-auto">
        <h1>{post.title}</h1>

        {post.publishedAt && (
          <time className="text-gray-600" dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        )}

        {post.excerpt && (
          <p className="text-xl text-gray-600 italic">{post.excerpt}</p>
        )}

        <div className="mt-8">
          {/* @ts-expect-error - Lexical content type */}
          {post.content && <div dangerouslySetInnerHTML={{ __html: JSON.stringify(post.content) }} />}
        </div>
      </article>

      {/* Enable live preview - this component will refresh the page when changes are saved in the admin panel */}
      <RefreshRouteOnSave />
    </div>
  )
}

// Generate static params for all published posts
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
  })

  return posts.docs.map((post) => ({
    slug: post.slug as string,
  }))
}
