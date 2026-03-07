// app/layout.tsx
import type { Metadata } from 'next';
import { DM_Sans, Syne, Space_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import SyncUser from './components/SyncUser';
import CollegeOnboarding from './components/CollegeOnboarding';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-dm-sans',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-syne',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: 'RK Skills & Solutions — Campus Placement Leaders',
  description: 'Industry-Aligned CRT & Technical Skills Training',
  icons: {
    icon: "/team/logo.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${syne.variable} ${spaceMono.variable}`}>
      <head>
        <meta name="theme-color" content="#060913" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased bg-[#060913] text-[#EAF2FF] min-h-screen">
        <Providers>
          <SyncUser />
          <CollegeOnboarding />
          {children}
        </Providers>
      </body>
    </html>
  );
}