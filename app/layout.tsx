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
                  
                  // Set document attributes
                  document.documentElement.lang = savedLocale;
                  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
                  
                  // Add RTL class to html element for styling
                  if (isRTL) {
                    document.documentElement.classList.add('rtl');
                    document.documentElement.classList.remove('ltr');
                  } else {
                    document.documentElement.classList.add('ltr');
                    document.documentElement.classList.remove('rtl');
                  }
                  
                  // Store in window for React context to use
                  window.__INITIAL_LOCALE__ = savedLocale;
                  window.__IS_RTL__ = isRTL;
                } catch (e) {
                  // Fallback to English/LTR
                  document.documentElement.lang = 'en';
                  document.documentElement.dir = 'ltr';
                  document.documentElement.classList.add('ltr');
                  document.documentElement.classList.remove('rtl');
                  window.__INITIAL_LOCALE__ = 'en';
                  window.__IS_RTL__ = false;
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
