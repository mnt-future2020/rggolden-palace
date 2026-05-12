import { Poppins } from "next/font/google";
import "./globals.css";
import ClientProviders from "../Components/providers/ClientProviders";
import { getHotelDatabase } from "../utils/config/hotelConnection";
import { SeoSchema } from "../utils/model/webSettings/SeoSchema";

export const dynamic = "force-dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

async function getSeoData() {
  try {
    await getHotelDatabase();
    const seoData = await SeoSchema.findOne({});
    return (
      seoData || {
        metaTitle: "RG Golden Palace",
        metaDescription: "RG Golden Palace Mahal Wedding Venue Singampunari Sivagangai",
        metaKeywords: "wedding mahal,mahal venue,wedding venue, singampunari, sivagangai, mahal, RG Golden Palace",
      }
    );
  } catch (error) {
    console.error("Error fetching SEO data:", error);
    return null;
  }
}

export async function generateMetadata() {
  const seoData = await getSeoData();

  return {
    title: seoData?.metaTitle || "Your App Name",
    description:
      seoData?.metaDescription || "Your app description for SEO purposes",
    keywords: seoData?.metaKeywords || "",
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#000000" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png" />
        
        {/* Apple Mobile Web App */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hotel App" />
        
        {/* Mobile Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      </head>
      <body className={`${poppins.className} template-color-1`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
