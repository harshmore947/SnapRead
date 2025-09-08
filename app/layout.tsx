import type { Metadata } from "next";
import { Source_Sans_3 as FontSans } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const fontSans = FontSans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SnapRead - AI powered PDF summarization",
  description: "SnapRead is an app for summarizing pdfs",
  icons: {
    icon: [{ url: "/snapread-favicon.svg", type: "image/svg+xml" }],
    shortcut: "/snapread-favicon.svg",
    apple: "/snapread-favicon.svg",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${fontSans.variable} font-sans antialiased`}>
          <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#333",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow:
                  "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                padding: "12px 16px",
                fontSize: "14px",
                fontWeight: "500",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
