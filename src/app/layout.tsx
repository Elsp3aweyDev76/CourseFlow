import { Suspense } from 'react';
import ServerNavbar from '@/components/ServerNavbar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans bg-slate-50 text-slate-900 antialiased">
        <Suspense fallback={null}>
          <ServerNavbar />
        </Suspense>

        {children}
      </body>
    </html>
  );
}