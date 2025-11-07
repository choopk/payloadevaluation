import { getPayloadClient } from './client'
import type { Where } from 'payload'

/**
 * Collection of helper functions demonstrating common Payload Local API operations
 * These examples show best practices for working with the Local API in Next.js
 */

/**
 * Find all documents in a collection
 *
 * @example
 * ```typescript
 * const products = await findAll('products')
 * ```
 */
export async function findAll(collection: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    limit: 100,
  })
  return result.docs
}

/**
 * Find documents with pagination
 *
 * @example
 * ```typescript
 * const { docs, totalPages } = await findWithPagination('products', 1, 10)
 * ```
 */
export async function findWithPagination(
  collection: string,
  page: number = 1,
  limit: number = 10
) {
  const payload = await getPayloadClient()
  return await payload.find({
    collection,
    page,
    limit,
  })
}

/**
 * Find documents with a where query
 *
 * @example
 * ```typescript
 * const featuredProducts = await findWhere('products', {
 *   featured: { equals: true }
 * })
 * ```
 */
export async function findWhere(collection: string, where: Where) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    where,
  })
  return result.docs
}

/**
 * Find a single document by ID
 *
 * @example
 * ```typescript
 * const product = await findById('products', '123')
 * ```
 */
export async function findById(collection: string, id: string | number) {
  const payload = await getPayloadClient()
  return await payload.findByID({
    collection,
    id,
  })
}

/**
 * Find a single document by a field value
 *
 * @example
 * ```typescript
 * const product = await findBySlug('products', 'awesome-product')
 * ```
 */
export async function findBySlug(collection: string, slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })
  return result.docs[0] || null
}

/**
 * Create a new document
 *
 * @example
 * ```typescript
 * const newProduct = await createDocument('products', {
 *   name: 'New Product',
 *   slug: 'new-product',
 *   price: 99.99,
 *   category: 'electronics',
 *   inStock: true
 * })
 * ```
 */
export async function createDocument(collection: string, data: any) {
  const payload = await getPayloadClient()
  return await payload.create({
    collection,
    data,
  })
}

/**
 * Update a document by ID
 *
 * @example
 * ```typescript
 * const updated = await updateDocument('products', '123', {
 *   price: 79.99,
 *   inStock: true
 * })
 * ```
 */
export async function updateDocument(
  collection: string,
  id: string | number,
  data: any
) {
  const payload = await getPayloadClient()
  return await payload.update({
    collection,
    id,
    data,
  })
}

/**
 * Delete a document by ID
 *
 * @example
 * ```typescript
 * await deleteDocument('products', '123')
 * ```
 */
export async function deleteDocument(collection: string, id: string | number) {
  const payload = await getPayloadClient()
  return await payload.delete({
    collection,
    id,
  })
}

/**
 * Count documents in a collection
 *
 * @example
 * ```typescript
 * const count = await countDocuments('products')
 * ```
 */
export async function countDocuments(collection: string, where?: Where) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    where,
    limit: 0,
  })
  return result.totalDocs
}

/**
 * Find documents with complex queries
 *
 * @example
 * ```typescript
 * const products = await findWithComplexQuery('products', {
 *   and: [
 *     { category: { equals: 'electronics' } },
 *     { price: { less_than: 100 } },
 *     { inStock: { equals: true } }
 *   ]
 * })
 * ```
 */
export async function findWithComplexQuery(collection: string, where: Where) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    where,
    sort: '-createdAt',
  })
  return result.docs
}

/**
 * Search documents with full-text search
 *
 * @example
 * ```typescript
 * const results = await searchDocuments('products', 'laptop')
 * ```
 */
export async function searchDocuments(collection: string, searchTerm: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection,
    where: {
      or: [
        { name: { contains: searchTerm } },
        { description: { contains: searchTerm } },
      ],
    },
  })
  return result.docs
}
