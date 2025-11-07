import jwt from 'jsonwebtoken'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payloadToken = 'payload-token'

export async function GET(req: Request): Promise<Response> {
  const payload = await getPayload({ config: configPromise })
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  const collection = searchParams.get('collection')
  const slug = searchParams.get('slug')

  // Validate required parameters
  if (!path) {
    return new Response('No path provided', { status: 404 })
  }

  // Get token from cookies
  const cookieStore = await import('next/headers').then(m => m.cookies())
  const token = (await cookieStore).get(payloadToken)?.value

  if (!token) {
    await draftMode().then(d => d.disable())
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  // Verify JWT token
  let user
  try {
    user = jwt.verify(token, payload.secret)
  } catch (error) {
    payload.logger.error('Token verification failed:', error)
    await draftMode().then(d => d.disable())
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  if (!user) {
    await draftMode().then(d => d.disable())
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  // Optionally verify the document exists (with draft: true to include drafts)
  if (collection && slug) {
    try {
      const result = await payload.find({
        collection: collection as any,
        where: {
          slug: {
            equals: slug,
          },
        },
        draft: true,
        depth: 0,
        limit: 1,
      })

      if (!result.docs.length) {
        return new Response('Document not found', { status: 404 })
      }
    } catch (error) {
      payload.logger.error('Error finding document:', error)
    }
  }

  // Enable draft mode
  await draftMode().then(d => d.enable())

  // Redirect to the path
  redirect(path)
}
