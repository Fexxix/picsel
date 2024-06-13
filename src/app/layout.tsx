import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { ClerkProvider } from "@clerk/nextjs"

import "./globals.css"
import { QueryClientProviderWrapper } from "@/components/query-client-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Picsel",
  description: "A photo gallery app",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        href: "/favicon-light.svg",
        url: "/",
      },
      {
        media: "(prefers-color-scheme: dark)",
        href: "/favicon-dark.svg",
        url: "/favicon-dark.svg",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} h-screen`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="grid grid-rows-[auto,1fr] size-full">
              <QueryClientProviderWrapper>
                <Header />
                {children}
              </QueryClientProviderWrapper>
            </div>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
