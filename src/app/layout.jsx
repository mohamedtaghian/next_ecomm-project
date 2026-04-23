import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export const metadata = {
  title: "FreshCart - Online Grocery Store",
  description: "FreshCart brings the supermarket to you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main className="bg-white py-[80px]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
