import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Fintrixy",
  description: "Fintrixy - Controle suas finanças",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
