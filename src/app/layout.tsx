import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import AppWalletProvider from "@/component/AppWalletProvider";
import Providers from "@/component/Provider";
import "../../polyfills";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = "ZkTerminal";
const APP_DEFAULT_TITLE = "ZkTerminal - Solana PWA App";
const APP_TITLE_TEMPLATE = "%s - ZkTerminal";
const APP_DESCRIPTION = "ZkTerminal - A PWA-enabled Solana dApp";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
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
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head />
      <body className={cn(inter.className, "custom-scrollbar")}>
        <Providers>
          <AppWalletProvider>
            {children}
            <Toaster position="top-right" richColors />
          </AppWalletProvider>
        </Providers>
      </body>
    </html>
  );
}

// import type { Metadata, Viewport } from "next";
// import type { ReactNode } from "react";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import AppWalletProvider from "@/component/AppWalletProvider";
// import Providers from "@/component/Provider";
// import '../../polyfills';

// const inter = Inter({ subsets: ["latin"] });

// const APP_NAME = "ZkSurfer";
// const APP_DEFAULT_TITLE = "ZkSurfer - Solana PWA App";
// const APP_TITLE_TEMPLATE = "%s - ZkSurfer";
// const APP_DESCRIPTION = "ZkSurfer - A PWA-enabled Solana dApp";

// export const metadata: Metadata = {
//   applicationName: APP_NAME,
//   title: {
//     default: APP_DEFAULT_TITLE,
//     template: APP_TITLE_TEMPLATE,
//   },
//   description: APP_DESCRIPTION,
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: "default",
//     title: APP_DEFAULT_TITLE,
//   },
//   formatDetection: {
//     telephone: false,
//   },
//   openGraph: {
//     type: "website",
//     siteName: APP_NAME,
//     title: {
//       default: APP_DEFAULT_TITLE,
//       template: APP_TITLE_TEMPLATE,
//     },
//     description: APP_DESCRIPTION,
//   },
//   twitter: {
//     card: "summary",
//     title: {
//       default: APP_DEFAULT_TITLE,
//       template: APP_TITLE_TEMPLATE,
//     },
//     description: APP_DESCRIPTION,
//   },
//   manifest: "/manifest.json",
// };

// export const viewport: Viewport = {
//   themeColor: "#FFFFFF",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" dir="ltr">
//       <head />
//       <body className={inter.className}>
//         <Providers>
//           {/* Wrapping the app with both RainbowKit and Solana wallet providers */}
//           <AppWalletProvider>
//             {children}
//           </AppWalletProvider>
//         </Providers>
//       </body>
//     </html>
//   );
// }
