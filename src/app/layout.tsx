import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseProvider } from '@/firebase';
import { cn } from '@/lib/utils';
import './globals.css';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeading = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

export const metadata: Metadata = {
  title: 'OpinionLoop',
  description:
    'Turn opinions into meaningful insights. Collect structured feedback, analyze responses instantly, and make smarter decisions with confidence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased flex flex-col',
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <FirebaseProvider>
          <div className="flex-1 flex flex-col">{children}</div>
          <Toaster />
        </FirebaseProvider>

        <footer className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-gray-400 py-6 border-t border-gray-800">
          <div className="max-w-6xl mx-auto text-center space-y-2 px-4">
            <p className="text-sm font-medium text-gray-300">
              © {new Date().getFullYear()} Siddesh B. All rights reserved.
            </p>
            <p className="text-sm">
              Contact:{' '}
              <a
                href="mailto:siddeshb.contact@gmail.com"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 underline-offset-2 hover:underline"
              >
                siddeshb.contact@gmail.com
              </a>
            </p>
            <p className="text-xs text-gray-500">
              OpinionLoop • Built with Next.js & Firebase
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
