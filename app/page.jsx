"use client";
import { useSession, signOut, SessionProvider } from "next-auth/react";
import Link from "next/link";

function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

function Header() {
  const { data: session } = useSession();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌸</span>
          <span className="font-bold text-xl text-pink-600">BL Review</span>
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-sm text-gray-700">
                👤 {session.user.username}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-gray-500 hover:text-pink-600"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:text-pink-600">
                Đăng nhập
              </Link>
              <Link
                href="/login?tab=register"
                className="bg-pink-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-pink-600"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function TruyenCard({ truyen }) {
  return (
    <Link
      href={`/truyen/${truyen.slug}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
    >
      <div className="relative aspect-[3/4] bg-gray-100">
        {truyen.anhBia ? (
          <img src={truyen.anhBia} alt={truyen.ten}
            className="w-full h-full object-cover group-hover:scale-105 transition" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📖</div>
        )}
        {truyen.warning?.includes("18+") && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">18+</span>
        )}
        {truyen.diemTB > 0 && (
          <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            ⭐ {truyen.diemTB.toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-pink-600">
          {truyen.ten}
        </h3>
        <div className="flex flex-wrap gap-1">
          {truyen.tags?.slice(0, 2).map(t => (
            <span key={t} className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  // Demo data (thay bằng fetch DB khi đã setup Prisma)
  const demo = [
    { id: 1, slug: "truyen-1", ten: "Yêu Em Từ Cái Nhìn Đầu Tiên", anhBia: "", tags: ["Ngọt", "HE"], warning: [], diemTB: 9.2 },
    { id: 2, slug: "truyen-2", ten: "Học Đường Ngọt Ngào", anhBia: "", tags: ["Học đường"], warning: [], diemTB: 8.5 },
    { id: 3, slug: "truyen-3", ten: "Ngược Đãi Tình Yêu", anhBia: "", tags: ["Ngược", "BE"], warning: ["18+"], diemTB: 9.5 },
    { id: 4, slug: "truyen-4", ten: "Cổ Đại Duyên", anhBia: "", tags: ["Cổ đại"], warning: [], diemTB: 8.8 }
  ];

  return (
    <Providers>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-2xl p-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            🌸 Cẩm nang truyện Boylove
          </h1>
          <p className="text-pink-100 mb-5 max-w-2xl">
            Review, đánh giá và chia sẻ link đọc <b>chính thống</b>.
          </p>
          <a href="#list"
            className="inline-block bg-white text-pink-600 font-semibold px-6 py-3 rounded-lg hover:bg-pink-50">
            Khám phá truyện →
          </a>
        </section>

        <section id="list">
          <h2 className="text-xl font-bold mb-4">🆕 Mới cập nhật</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {demo.map(t => <TruyenCard key={t.id} truyen={t} />)}
          </div>
        </section>
      </main>
      <footer className="text-center text-gray-500 py-8 text-sm">
        © 2025 BL Review — Chỉ chia sẻ link chính thống 🌸
      </footer>
    </Providers>
  );
}
