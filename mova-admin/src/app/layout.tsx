'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Auth0Provider } from '@auth0/auth0-react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Auth0Provider
          domain='mova-mobile.eu.auth0.com'
          clientId='agF68GBmUpodwqI6q34oaSyvbwsMQ70M'
          authorizationParams={{ redirect_uri: typeof window !== 'undefined' ? window.location.origin : '' }}
        >
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}
