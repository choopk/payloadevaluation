import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * Get an initialized Payload instance
 *
 * This utility provides a consistent way to access the Payload Local API
 * across your Next.js application. It handles configuration and initialization
 * automatically.
 *
 * Usage:
 * ```typescript
 * import { getPayloadClient } from '@/lib/payload/client'
 *
 * const payload = await getPayloadClient()
 * const posts = await payload.find({ collection: 'media' })
 * ```
 *
 * @returns A promise that resolves to an initialized Payload instance
 */
export async function getPayloadClient() {
  return await getPayload({ config: configPromise })
}
