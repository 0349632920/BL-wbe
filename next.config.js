/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",   // ⚡ Render cần cái này để build gọn
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }  // cho phép ảnh từ mọi domain
    ]
  }
};

module.exports = nextConfig;
