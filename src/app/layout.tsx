import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatbot Môi Trường - Hỏi đáp về bảo vệ môi trường",
  description:
    "Trò chuyện với chatbot về môi trường, giúp bạn tìm hiểu cách bảo vệ thiên nhiên và sống xanh hơn.",
  keywords: "chatbot, môi trường, bảo vệ môi trường, sống xanh, AI chatbot",
  authors: [
    { name: "Thanh Dev", url: "https://thanhdev.io.vn" },
    { name: "ChatBot", url: "https://chatbot-ai-eco.vercel.app" },
  ],
  openGraph: {
    title: "Chatbot Môi Trường - Hỏi đáp về bảo vệ môi trường",
    description:
      "Trò chuyện với chatbot về môi trường, giúp bạn tìm hiểu cách bảo vệ thiên nhiên và sống xanh hơn.",
    url: "https://chatbot-ai-eco.vercel.app",
    siteName: "Chatbot Môi Trường",
    images: [
      {
        url: "https://chatbot-ai-eco.vercel.app/images/chatbot-banner.webp",
        width: 1200,
        height: 630,
        alt: "Chatbot Môi Trường",
      },
    ],
    type: "website",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chatbot Môi Trường",
    description: "Chatbot giúp bạn tìm hiểu về bảo vệ môi trường.",
    images: ["https://chatbot-ai-eco.vercel.app/images/chatbot-banner.webp"],
    creator: "@chithanh17",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
