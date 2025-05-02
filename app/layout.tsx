import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "./providers";
import NavBar from "./components/navbar";

export const metadata: Metadata = {
  title: "NCHA Dashboard",
  description: "NCHA Dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en" className="light">
        <body>
          <NavBar />
          {children}
        </body>
      </html>
    </Providers>
  )
}
