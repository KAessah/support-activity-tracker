import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: {
    default: "Support Activity Tracker",
    template: "%s · Support Activity Tracker",
  },
  description: "Track the daily activities of the applications support team.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        {children}
        <Toaster position="bottom-right" toastOptions={{ className: "!rounded-2xl !font-sans" }} richColors />
      </body>
    </html>
  );
}
