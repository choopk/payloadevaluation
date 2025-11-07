import { getPayloadClient } from '@/lib/payload/client'
import { ServerActionsDemo } from './ServerActionsDemo'
import Link from 'next/link'

/**
 * Server Actions Example Page
 *
 * This page demonstrates how to use Payload Local API with Next.js Server Actions
 * for data mutations. Server Actions provide a type-safe way to perform server-side
 * operations from client components.
 */
export default async function ServerActionsPage() {
  // Fetch products server-side
  const payload = await getPayloadClient()
  const products = await payload.find({
    collection: 'products',
    limit: 100,
    sort: '-createdAt',
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/examples/local-api"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Local API Examples
        </Link>
        <h1 className="text-4xl font-bold mb-4">Server Actions Example</h1>
        <p className="text-gray-600">
          This page demonstrates how to use Payload Local API with Next.js Server Actions
          for CRUD operations. All mutations are performed server-side with automatic
          revalidation.
        </p>
      </div>

      <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h3 className="font-bold mb-2">What are Server Actions?</h3>
        <p className="text-sm text-blue-700">
          Server Actions are asynchronous functions that run on the server. They can be
          called from client or server components, providing a type-safe way to perform
          mutations. All actions automatically trigger revalidation of affected pages.
        </p>
      </div>

      {/* Code Example */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Example Server Action</h2>
        <div className="bg-gray-50 p-4 rounded overflow-x-auto">
          <code className="text-sm whitespace-pre">{`'use server'

import { getPayloadClient } from '@/lib/payload/client'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData) {
  const payload = await getPayloadClient()

  const product = await payload.create({
    collection: 'products',
    data: formData,
  })

  // Automatically revalidate affected pages
  revalidatePath('/examples/local-api')

  return { success: true, data: product }
}`}</code>
        </div>
      </section>

      {/* Interactive Demo */}
      <ServerActionsDemo initialProducts={products.docs} />
    </div>
  )
}
