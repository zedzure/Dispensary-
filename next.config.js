/** @type {import('next').NextConfig} */
const nextConfig = {
  // 'output: "export"' is removed to enable server-side rendering for Firebase App Hosting
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // This can be set to false if you are using a server-based deployment
    unoptimized: true, 
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'avatar.vercel.sh', pathname: '/**' },
    ],
  },
  // We need to extend the server action timeout for longer running AI tasks
  serverActions: {
      bodySizeLimit: '2mb', // Allow larger image uploads
  },
  experimental: {
  },
};

module.exports = nextConfig;
