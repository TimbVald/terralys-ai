import Navbar  from '@/components/landing/navbar';
import ReactLenis from 'lenis/react';
import Footer from '@/components/landing/footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactLenis root>
      <Navbar />
      {children}
      <Footer />
    </ReactLenis>
  );
}