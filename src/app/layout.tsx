import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Secret Scribbles',
  description: 'Your AI-powered creative writing partner.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
