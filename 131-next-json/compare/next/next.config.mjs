/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Each version of the route handler builds into its own folder (build-variants.sh): DIST=.next-zod.
  distDir: process.env.DIST ?? '.next',
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
