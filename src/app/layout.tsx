/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

const TanStackProvider = dynamic(
  () => import("@/components/providers/TanStackProvider"),
  {
    ssr: false,
  }
);
const ThemeProvider = dynamic(
  () => import("@/components/providers/ThemeProvider"),
  {
    ssr: false,
  }
);

const APP_NAME = "Shop System";
const APP_DEFAULT_TITLE = "Shop System";
const APP_TITLE_TEMPLATE = "%s - Shop System";
const APP_DESCRIPTION = "Best Shop System in the world!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body>
        <AppRouterCacheProvider options={{ key: "css" }}>
          <ThemeProvider>
            <TanStackProvider>{children}</TanStackProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
