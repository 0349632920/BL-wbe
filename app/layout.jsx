import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";

export const metadata = {
  title: "BL Review — Cẩm nang truyện Boylove"
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="bg-pink-50 min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
            {children}
          </main>
          <footer className="text-center text-gray-500 py-6 text-sm border-t border-pink-100">
            © 2025 BL Review — Chỉ chia sẻ link chính thống 🌸
          </footer>
        </Providers>
      </body>
    </html>
  );
}
