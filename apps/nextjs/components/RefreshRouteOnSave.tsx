'use client'

import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

/**
 * This component enables server-side live preview by refreshing the route
 * whenever content is saved in the Payload admin panel.
 *
 * For Next.js App Router, this uses router.refresh() which will hydrate
 * the HTML using new data straight from the Local API.
 */
export const RefreshRouteOnSave: React.FC = () => {
  const router = useRouter()

  return (
    <PayloadLivePreview
      refresh={async () => {
        router.refresh()
      }}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL || ''}
    />
  )
}
