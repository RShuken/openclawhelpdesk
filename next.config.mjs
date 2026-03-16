/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true, formats: ['image/webp'] },
  poweredByHeader: false,
}
export default nextConfig
