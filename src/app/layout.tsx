import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'UnityAid | Social Development Events Platform',
  description: 'A community-driven event management platform to create, join, and track local social service events and humanitarian drives across Bangladesh.',
  keywords: ['community service', 'social development', 'events', 'volunteering', 'winter relief', 'tree plantation', 'cleanup'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col justify-between selection:bg-green-500 selection:text-white">
        <Script 
          src="https://accounts.google.com/gsi/client" 
          strategy="afterInteractive" 
        />
        <ThemeProvider>
          <AuthProvider>
            <Toaster 
              position="top-right" 
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#fff',
                  borderRadius: '12px',
                },
              }}
            />
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

