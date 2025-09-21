import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import ToasterProvider from "@/components/providers/ToasterProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Movie Database",
  description: "Manage your movie collection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className={montserrat.className} suppressHydrationWarning={true}>
        <ReduxProvider>
          {children}
          <ToasterProvider />
        </ReduxProvider>
      </body>
    </html>
  );
}
