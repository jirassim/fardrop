import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FarcasterProvider } from "./providers";
import WalletConnect from "./components/WalletConnect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.NEXT_PUBLIC_URL || 'https://airdrop-checker-nine-mu.vercel.app';

export const metadata: Metadata = {
  title: "Airdrop Eligibility Checker",
  description: "Check your Base & Farcaster activity for airdrop eligibility estimates",
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "Airdrop Eligibility Checker",
    description: "Check your Base & Farcaster activity for airdrop eligibility",
    images: [{
      url: `${APP_URL}/splash.png`,
      width: 1200,
      height: 800,
      alt: "Airdrop Checker",
    }],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: "1",
      imageUrl: `${APP_URL}/splash.png`,
      button: {
        title: "Check Eligibility",
        action: {
          type: "launch_miniapp",
          name: "Airdrop Checker",
          url: APP_URL
        }
      }
    }),
    'fc:frame': JSON.stringify({
      version: "1",
      imageUrl: `${APP_URL}/splash.png`,
      button: {
        title: "Check Eligibility",
        action: {
          type: "launch_frame",
          name: "Airdrop Checker",
          url: APP_URL
        }
      }
    }),
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#578BFA" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FarcasterProvider>
          <WalletConnect />
          {children}
        </FarcasterProvider>
      </body>
    </html>
  );
}
