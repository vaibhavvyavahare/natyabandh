import { Geist, Geist_Mono, Yatra_One } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const yatraOne = Yatra_One({
  weight: '400',
  variable: "--font-yatra-one",
  subsets: ["devanagari", "latin"],
});

export const metadata = {
  title: "Natyabandh",
  description: "The Legacy of Art, The Passion for Theatre!",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${yatraOne.variable} antialiased`}
    >
      <body className="min-h-screen bg-black text-white antialiased pt-16">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
