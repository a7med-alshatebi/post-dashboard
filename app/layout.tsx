import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { ToastProvider } from "../components/toast";
import { AuthProvider } from "../contexts/AuthContext";
import { I18nProvider } from "../contexts/I18nContext";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedLocale = localStorage.getItem('locale') || 'en';
                  const isRTL = savedLocale === 'ar';
                  
                  // Set document attributes immediately
                  document.documentElement.lang = savedLocale;
                  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
                  
                  // Add class for immediate styling
                  document.documentElement.className = document.documentElement.className.replace(/\\b(rtl|ltr)\\b/g, '');
                  document.documentElement.classList.add(isRTL ? 'rtl' : 'ltr');
                } catch (e) {
                  document.documentElement.lang = 'en';
                  document.documentElement.dir = 'ltr';
                  document.documentElement.classList.add('ltr');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <I18nProvider>
            <AuthProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
