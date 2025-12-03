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

export const metadata: Metadata = {
  title: "Airdrop Eligibility Checker",
  description: "Check your Base & Farcaster activity for airdrop eligibility estimates",
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Airdrop Eligibility Checker",
    description: "Check your Base & Farcaster activity for airdrop eligibility",
    images: ["/api/og"],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': '/api/og',
    'fc:frame:button:1': 'Check Eligibility',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': '/',
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
