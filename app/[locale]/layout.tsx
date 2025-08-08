import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "../../components/theme-provider";
import { ToastProvider } from "../../components/toast";
import { AuthProvider } from "../../contexts/AuthContext";
import { notFound } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Post Dashboard",
  description: "A modern dashboard for managing posts from JSONPlaceholder API",
};

const locales = ['en', 'ar'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await the params since they're a Promise in Next.js 15
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    notFound();
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
