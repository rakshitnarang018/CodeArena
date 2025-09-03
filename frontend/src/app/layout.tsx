import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { EventProvider } from "@/contexts/EventContext";
import { Toaster } from "@/components/ui/sonner";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeArena - Hackathon & Event Platform",
  description:
    "The modern platform for hackathons, competitions, and tech events. Faster, cleaner, and more engaging than ever.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          <AuthProvider>
            <EventProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
              <Toaster richColors />
            </EventProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
