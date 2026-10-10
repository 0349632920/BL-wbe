import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "BL Review — Cẩm nang truyện Boylove"
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="bg-pink-50 min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
