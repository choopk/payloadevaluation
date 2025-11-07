import { getPayloadClient } from '@/lib/payload/client'
import { findWhere, findBySlug, countDocuments } from '@/lib/payload/operations'
import Link from 'next/link'

/**
 * Local API Examples - Server Component
 *
 * This page demonstrates various ways to use the Payload Local API
 * in Next.js Server Components. All data is fetched server-side,
 * providing optimal performance and SEO.
 */
export default async function LocalAPIExamplesPage() {
  // Example 1: Get all products
  const payload = await getPayloadClient()
  const allProducts = await payload.find({
    collection: 'products',
    limit: 10,
    sort: '-createdAt',
  })

  // Example 2: Get featured products using helper
  const featuredProducts = await findWhere('products', {
    featured: { equals: true },
  })

  // Example 3: Get products by category
  const electronicsProducts = await findWhere('products', {
    category: { equals: 'electronics' },
  })

  // Example 4: Count total products
  const totalProducts = await countDocuments('products')

  // Example 5: Count products in stock
  const inStockCount = await countDocuments('products', {
    inStock: { equals: true },
  })

  // Example 6: Complex query - featured electronics under $100
  const affordableFeaturedElectronics = await payload.find({
    collection: 'products',
    where: {
      and: [
        { category: { equals: 'electronics' } },
        { featured: { equals: true } },
        { price: { less_than: 100 } },
        { inStock: { equals: true } },
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

      {/* Example 1: All Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Example 1: All Products (Latest 10)
        </h2>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <code className="text-sm">
            {`const allProducts = await payload.find({
  collection: 'products',
  limit: 10,
  sort: '-createdAt',
})`}
          </code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProducts.docs.length > 0 ? (
            allProducts.docs.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No products found. Create some products in the admin panel to see them here.
            </p>
          )}
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Total: {allProducts.totalDocs} products | Page {allProducts.page} of{' '}
          {allProducts.totalPages}
        </div>
      </section>

      {/* Example 2: Featured Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Example 2: Featured Products</h2>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <code className="text-sm">
            {`const featuredProducts = await findWhere('products', {
  featured: { equals: true },
})`}
          </code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} featured />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No featured products found.
            </p>
          )}
        </div>
      </section>

      {/* Example 3: Products by Category */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Example 3: Electronics Category
        </h2>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <code className="text-sm">
            {`const electronicsProducts = await findWhere('products', {
  category: { equals: 'electronics' },
})`}
          </code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {electronicsProducts.length > 0 ? (
            electronicsProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No electronics products found.
            </p>
          )}
        </div>
      </section>

      {/* Example 4: Statistics */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Example 4: Statistics</h2>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <code className="text-sm">
            {`const totalProducts = await countDocuments('products')
const inStockCount = await countDocuments('products', {
  inStock: { equals: true },
})`}
          </code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon="📦"
          />
          <StatCard
            title="In Stock"
            value={inStockCount}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Out of Stock"
            value={totalProducts - inStockCount}
            icon="❌"
            color="red"
          />
        </div>
      </section>

      {/* Example 5: Complex Query */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">
          Example 5: Complex Query (Featured Electronics Under $100)
        </h2>
        <div className="bg-gray-50 p-4 rounded mb-4 overflow-x-auto">
          <code className="text-sm whitespace-pre">
            {`const products = await payload.find({
  collection: 'products',
  where: {
    and: [
      { category: { equals: 'electronics' } },
      { featured: { equals: true } },
      { price: { less_than: 100 } },
      { inStock: { equals: true } },
    ],
  },
})`}
          </code>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {affordableFeaturedElectronics.docs.length > 0 ? (
            affordableFeaturedElectronics.docs.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-500 col-span-full">
              No products matching these criteria.
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
            href="/api/examples/products"
            className="block text-blue-600 hover:underline"
            target="_blank"
          >
            → API Routes Example (GET /api/examples/products)
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

// Product Card Component
function ProductCard({ product, featured }: { product: any; featured?: boolean }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      {featured && (
        <span className="inline-block px-2 py-1 text-xs bg-yellow-400 text-black rounded mb-2">
          ⭐ Featured
        </span>
      )}
      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-2 capitalize">
        {product.category?.replace('-', ' ')}
      </p>
      <p className="text-2xl font-bold text-blue-600 mb-2">
        ${product.price?.toFixed(2)}
      </p>
      <div className="flex items-center justify-between text-sm">
        <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
          {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
        </span>
        {product.inventory !== undefined && (
          <span className="text-gray-500">Qty: {product.inventory}</span>
        )}
      </div>
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
    red: 'bg-red-50 border-red-200',
  }

  return (
    <div className={`border rounded-lg p-6 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-600">{title}</div>
    </div>
  )
}
