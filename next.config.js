/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Deploying to deeprodraws.github.io (root domain repo)? Leave basePath empty.
  // Deploying to username.github.io/reponame? Uncomment the line below:
  // basePath: '/reponame',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
