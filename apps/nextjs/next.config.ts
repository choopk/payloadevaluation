import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  turbopack: {
    root: path.join(__dirname, '../../')
  },
  serverExternalPackages: ['@payloadcms/db-postgres']
};

export default withPayload(nextConfig);
