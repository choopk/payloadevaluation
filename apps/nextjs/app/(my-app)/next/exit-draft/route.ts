import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * This route handler disables draft mode and redirects to the specified path.
 * Usage: /next/exit-draft?path=/posts/my-post
 */
export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') || '/'

  // Disable draft mode
  await draftMode().then(d => d.disable())

  // Redirect to the specified path
  redirect(path)
}
