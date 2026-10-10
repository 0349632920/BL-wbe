import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "BL Review — Cẩm nang truyện Boylove",
  description: "Review, đánh giá và chia sẻ link đọc chính thống"
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="bg-pink-50 min-h-screen">
        <Providers>
          <Header />
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
          <footer className="text-center text-gray-500 py-8 text-sm border-t border-pink-100 mt-12">
            © 2025 BL Review — Chỉ chia sẻ link chính thống 🌸
          </footer>
        </Providers>
      </body>
    </html>
  );
}

// Header component nhúng luôn cho gọn
import { Header } from "./page";
