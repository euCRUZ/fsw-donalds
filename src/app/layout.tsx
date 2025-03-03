import "./globals.css"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { CartProvider } from "./[slug]/menu/context/cart"
import { Toaster } from "@/components/ui/sonner"

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  // description: "O melhor delivery do mundo, por Giovanni Cruz!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.className} antialiased`}>
        <CartProvider>{children}</CartProvider>

        <Toaster />
      </body>
    </html>
  )
}
