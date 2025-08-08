import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { notFound, redirect } from "next/navigation";

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
const defaultLocale = 'en';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This is a simple redirect to the default locale
  // In a real app, you might want to detect user's preferred language
  redirect(`/${defaultLocale}`);
}
