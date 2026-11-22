/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  async headers() {
    return [{ source: '/checkout', headers: [{ key: 'Content-Security-Policy', value: "default-src 'self'" }] }];
  },
};

export default nextConfig;
