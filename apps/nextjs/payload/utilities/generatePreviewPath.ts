import { CollectionSlug } from 'payload'

// Define URL prefixes for each collection
const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  // Add more collections here as needed
  // pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
}

/**
 * Generate a preview path for a given collection and slug
 * This constructs the URL that will be used by the preview feature
 */
export const generatePreviewPath = ({ collection, slug }: Props): string => {
  const prefix = collectionPrefixMap[collection] ?? ''
  const path = `${prefix}/${slug}`

  const params = {
    slug,
    collection,
    path,
  }

  const encodedParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    encodedParams.append(key, value)
  })

  return `/next/preview?${encodedParams.toString()}`
}
