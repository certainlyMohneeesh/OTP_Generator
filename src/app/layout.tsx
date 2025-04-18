import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import { Layout } from '@/components/common/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OTP Generator',
  description: 'Send OTP messages to your contacts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
} 