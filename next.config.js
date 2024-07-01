/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["avatea-website-backend.s3.amazonaws.com","avatea-bucket.s3.amazonaws.com","avatea-website-backend-staging.s3.amazonaws.com", "s2.coinmarketcap.com", "www.blocknative.com", "app.uniswap.org", "goerli.etherscan.io","127.0.0.1"],
  },
};

module.exports = nextConfig;
