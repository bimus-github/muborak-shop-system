import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  dest: "public",
  workboxOptions: {
    runtimeCaching: [
      // cashe all routes
      {
        urlPattern: "/",
        handler: "CacheFirst",
        options: {
          cacheName: "pages",
          expiration: {
            maxEntries: 200,
          },
        }
      },
      {
        // all url patern with /*
        urlPattern: /https?:\/\/.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "pages",
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 24 * 60 * 60,
          },
        },
      },
    ]
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withPWA(nextConfig);
