import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: "TechStack Solutions - Mobile & Web App Development",
  description: "Professional React Native mobile apps, React.js web applications, and full-stack solutions with Node.js. Expert development services with end-to-end support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
