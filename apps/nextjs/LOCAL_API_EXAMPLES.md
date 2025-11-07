# Payload CMS Local API Examples

This documentation provides comprehensive examples of using the Payload CMS Local API in Next.js applications. The Local API allows you to interact with your Payload data directly from your Next.js application without making HTTP requests.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Examples](#examples)
  - [1. Basic Usage](#1-basic-usage)
  - [2. API Routes](#2-api-routes)
  - [3. Server Components](#3-server-components)
  - [4. Server Actions](#4-server-actions)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The Payload Local API provides a type-safe way to interact with your CMS data directly in your Next.js application. It's faster than making HTTP requests because it bypasses the network layer and accesses your database directly.

### Benefits

- **Performance**: No network overhead
- **Type Safety**: Full TypeScript support
- **Simplicity**: Direct database access
- **Server-Side**: Works in Server Components, API Routes, and Server Actions
- **Integration**: Seamless with Next.js features like caching and revalidation

## Getting Started

### Prerequisites

- Next.js 15+ with App Router
- Payload CMS 3.0+
- PostgreSQL database

### Installation

The necessary packages are already installed in this project:

```json
{
  "@payloadcms/db-postgres": "^3.62.1",
  "@payloadcms/next": "^3.62.1",
  "payload": "^3.62.1"
}
```

### Configuration

The Payload configuration is located in `payload.config.mts`:

```typescript
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  collections: [Media, Products],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  // ... other config
})
```

## Project Structure

```
apps/nextjs/
├── lib/
│   └── payload/
│       ├── client.ts              # Payload client utility
│       └── operations.ts          # Common operations helpers
├── payload/
│   └── collections/
│       ├── Media.ts              # Media collection
│       └── Products.ts           # Products collection
├── app/(my-app)/
│   ├── api/
│   │   └── examples/
│   │       └── products/
│   │           ├── route.ts      # Products API routes
│   │           └── [id]/
│   │               └── route.ts  # Individual product routes
│   └── examples/
│       └── local-api/
│           ├── page.tsx          # Server Components examples
│           └── server-actions/
│               ├── page.tsx      # Server Actions demo page
│               ├── actions.ts    # Server Actions
│               └── ServerActionsDemo.tsx  # Client component
└── payload.config.mts            # Payload configuration
```

## Examples

### 1. Basic Usage

The most basic way to use the Local API is through our utility helper:

```typescript
import { getPayloadClient } from '@/lib/payload/client'

// Get the Payload instance
const payload = await getPayloadClient()

// Fetch all documents
const products = await payload.find({
  collection: 'products',
  limit: 10,
})

// Find by ID
const product = await payload.findByID({
  collection: 'products',
  id: '123',
})

// Create a document
const newProduct = await payload.create({
  collection: 'products',
  data: {
    name: 'New Product',
    slug: 'new-product',
    price: 99.99,
    category: 'electronics',
  },
})

// Update a document
const updated = await payload.update({
  collection: 'products',
  id: '123',
  data: {
    price: 79.99,
  },
})

// Delete a document
await payload.delete({
  collection: 'products',
  id: '123',
})
```

### 2. API Routes

Example API route using Local API (`app/(my-app)/api/examples/products/route.ts`):

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload/client'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'products',
    page,
    limit,
    sort: '-createdAt',
  })

  return NextResponse.json({
    success: true,
    data: result.docs,
    pagination: {
      page: result.page,
      totalPages: result.totalPages,
      totalDocs: result.totalDocs,
    },
  })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const payload = await getPayloadClient()

  const product = await payload.create({
    collection: 'products',
    data: body,
  })

  return NextResponse.json({
    success: true,
    data: product,
  })
}
```

**Try it:**
- GET: http://localhost:3000/api/examples/products
- GET with filters: http://localhost:3000/api/examples/products?category=electronics&inStock=true
- POST: Send JSON body to create a product

### 3. Server Components

Example Server Component (`app/(my-app)/examples/local-api/page.tsx`):

```typescript
import { getPayloadClient } from '@/lib/payload/client'
import { findWhere } from '@/lib/payload/operations'

export default async function ProductsPage() {
  // Example 1: Direct query
  const payload = await getPayloadClient()
  const allProducts = await payload.find({
    collection: 'products',
    limit: 10,
  })

  // Example 2: Using helper
  const featuredProducts = await findWhere('products', {
    featured: { equals: true },
  })

  // Example 3: Complex query
  const affordableProducts = await payload.find({
    collection: 'products',
    where: {
      and: [
        { price: { less_than: 100 } },
        { inStock: { equals: true } },
      ],
    },
  })

  return (
    <div>
      <h1>Products</h1>
      {allProducts.docs.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  )
}
```

**Try it:** Visit http://localhost:3000/examples/local-api

### 4. Server Actions

Server Actions provide a type-safe way to perform mutations from client components.

**Define the action** (`app/(my-app)/examples/local-api/server-actions/actions.ts`):

```typescript
'use server'

import { getPayloadClient } from '@/lib/payload/client'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: {
  name: string
  slug: string
  price: number
  category: string
}) {
  try {
    const payload = await getPayloadClient()

    const product = await payload.create({
      collection: 'products',
      data: formData,
    })

    // Revalidate to show updated data
    revalidatePath('/examples/local-api')

    return {
      success: true,
      data: product,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
```

**Use in a client component**:

```typescript
'use client'

import { createProduct } from './actions'

export function CreateProductForm() {
  async function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.target)

    const result = await createProduct({
      name: formData.get('name'),
      slug: formData.get('slug'),
      price: parseFloat(formData.get('price')),
      category: formData.get('category'),
    })

    if (result.success) {
      alert('Product created!')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <input name="slug" required />
      <input name="price" type="number" required />
      <select name="category" required>
        <option value="electronics">Electronics</option>
      </select>
      <button type="submit">Create</button>
    </form>
  )
}
```

**Try it:** Visit http://localhost:3000/examples/local-api/server-actions

## Common Patterns

### Querying with Where Conditions

```typescript
// Equals
const products = await payload.find({
  collection: 'products',
  where: {
    category: { equals: 'electronics' },
  },
})

// Less than / Greater than
const affordableProducts = await payload.find({
  collection: 'products',
  where: {
    price: {
      less_than: 100,
      greater_than: 10,
    },
  },
})

// Contains (search)
const searchResults = await payload.find({
  collection: 'products',
  where: {
    name: { contains: 'laptop' },
  },
})

// AND conditions
const specificProducts = await payload.find({
  collection: 'products',
  where: {
    and: [
      { category: { equals: 'electronics' } },
      { inStock: { equals: true } },
      { price: { less_than: 100 } },
    ],
  },
})

// OR conditions
const results = await payload.find({
  collection: 'products',
  where: {
    or: [
      { category: { equals: 'electronics' } },
      { category: { equals: 'books' } },
    ],
  },
})
```

### Pagination

```typescript
const result = await payload.find({
  collection: 'products',
  page: 1,
  limit: 10,
})

console.log(result.docs)        // Array of documents
console.log(result.page)        // Current page
console.log(result.totalPages)  // Total pages
console.log(result.totalDocs)   // Total documents
console.log(result.hasNextPage) // Boolean
console.log(result.hasPrevPage) // Boolean
```

### Sorting

```typescript
// Sort by field ascending
const products = await payload.find({
  collection: 'products',
  sort: 'price',
})

// Sort by field descending
const products = await payload.find({
  collection: 'products',
  sort: '-createdAt',
})

// Multiple sort fields
const products = await payload.find({
  collection: 'products',
  sort: '-featured,price',
})
```

### Relationships and Depth

```typescript
// Populate relationships (default depth: 0)
const products = await payload.find({
  collection: 'products',
  depth: 1, // Populate one level of relationships
})

// Deep population
const products = await payload.find({
  collection: 'products',
  depth: 2, // Populate two levels
})
```

## Best Practices

### 1. Use Helper Functions

Create reusable helper functions for common operations:

```typescript
// lib/payload/operations.ts
export async function findBySlug(collection: string, slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] || null
}
```

### 2. Error Handling

Always wrap Local API calls in try-catch:

```typescript
try {
  const product = await payload.findByID({
    collection: 'products',
    id,
  })
  return product
} catch (error) {
  console.error('Error fetching product:', error)
  throw new Error('Failed to fetch product')
}
```

### 3. Revalidation with Server Actions

Always revalidate affected paths:

```typescript
'use server'

import { revalidatePath } from 'next/cache'

export async function updateProduct(id, data) {
  const payload = await getPayloadClient()
  const updated = await payload.update({
    collection: 'products',
    id,
    data,
  })

  // Revalidate all affected pages
  revalidatePath('/products')
  revalidatePath(`/products/${id}`)

  return updated
}
```

### 4. Type Safety

Use TypeScript for better type safety:

```typescript
import type { Product } from '@/payload-types'

const product: Product = await payload.findByID({
  collection: 'products',
  id: '123',
})
```

### 5. Caching

Leverage Next.js caching for better performance:

```typescript
// This will be cached by Next.js
export async function getProducts() {
  'use cache'
  const payload = await getPayloadClient()
  return await payload.find({ collection: 'products' })
}
```

## Troubleshooting

### "Error: missing secret key"

**Solution:** Ensure `PAYLOAD_SECRET` is set in your `.env` file:

```bash
PAYLOAD_SECRET=your-secret-key-here
```

### "Collection not found"

**Solution:** Make sure the collection is imported in `payload.config.mts`:

```typescript
import { Products } from './payload/collections/Products'

export default buildConfig({
  collections: [Products],
})
```

### "Database connection error"

**Solution:** Check your `DATABASE_URI` in `.env`:

```bash
DATABASE_URI=postgresql://user:password@localhost:5432/database
```

### TypeScript errors with payload-types

**Solution:** Regenerate types:

```bash
pnpm payload generate:types
```

## Additional Resources

- [Payload Local API Documentation](https://payloadcms.com/docs/local-api/overview)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Payload Collections Documentation](https://payloadcms.com/docs/configuration/collections)

## Live Examples

All examples are available in this project:

- **Server Components**: Visit `/examples/local-api`
- **Server Actions**: Visit `/examples/local-api/server-actions`
- **API Routes**:
  - GET `/api/examples/products`
  - GET `/api/examples/products/[id]`
  - POST `/api/examples/products`
  - PATCH `/api/examples/products/[id]`
  - DELETE `/api/examples/products/[id]`

Start the development server and explore these examples:

```bash
pnpm dev
```

Then visit http://localhost:3000/examples/local-api
