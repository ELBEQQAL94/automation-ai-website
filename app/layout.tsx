// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-59ZK4N2LQY";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Automatoro | Eliminate Manual Busywork",
    template: "%s | Automatoro",
  },
  description:
    "AI-powered automation that connects the tools your team already uses, cuts manual busywork, and keeps a human in control of every important decision.",
  openGraph: {
    title: "Automatoro | Eliminate Manual Busywork",
    description:
      "AI-powered automation that connects the tools your team already uses, cuts manual busywork, and keeps a human in control of every important decision.",
    type: "website",
    url: SITE_URL,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automatoro | Eliminate Manual Busywork",
    description:
      "AI-powered automation that connects the tools your team already uses, cuts manual busywork, and keeps a human in control of every important decision.",
    images: [DEFAULT_OG_IMAGE.url],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Automatoro",
  url: SITE_URL,
  email: "elbeqqal.youssef@gmail.com",
  description:
    "Automatoro is an AI-powered process automation service that connects the tools teams already use, cuts manual busywork, and keeps a human in control of every important decision.",
  founder: {
    "@type": "Person",
    name: "Youssef Elbeqqal",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Automatoro",
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Automatoro Blog"
          href="/feed.xml"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="flex min-h-full flex-1 flex-col items-center bg-background">
          <Header />
          {children}
          <Footer />
        </div>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
