"use client";
import { useSession, SessionProvider } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

function RatingBar({ label, value }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="capitalize text-gray-700">{label}</span>
        <span className="font-semibold text-pink-600">{value}/10</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-gradient-to-r from-pink-400 to-pink-600 h-2 rounded-full"
          style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );
}

function ReviewForm({ truyenId, onSuccess }) {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    tieuDe: "", noiDung: "",
    diemNoiDung: 8, diemNhanVat: 8, diemCamXuc: 8, spoiler: false
  });
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <div className="bg-white rounded-xl p-6 mb-6 shadow-sm text-center">
        <p className="mb-3 text-gray-600">Đăng nhập để viết review</p>
        <Link href="/login"
          className="inline-block bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600">
          Đăng nhập
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const diemTong = +((form.diemNoiDung + form.diemNhanVat + form.diemCamXuc) / 3).toFixed(1);

    const res = await fetch("/api/auth?action=review", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form, truyenId, diemTong,
        userId: session.user.id
      })
    });

    setLoading(false);
    if (res.ok) {
      setForm({ tieuDe: "", noiDung: "", diemNoiDung: 8, diemNhanVat: 8, diemCamXuc: 8, spoiler: false });
      onSuccess?.();
      alert("✅ Đã gửi review!");
    } else {
      alert("❌ Có lỗi xảy ra!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 mb-6 shadow-sm">
      <h3 className="text-xl font-bold mb-4">✍️ Viết review</h3>
      <input type="text" placeholder="Tiêu đề..." required
        value={form.tieuDe}
        onChange={e => setForm({ ...form, tieuDe: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-pink-400" />
      <textarea placeholder="Cảm nhận của bạn..." required rows={5}
        value={form.noiDung}
        onChange={e => setForm({ ...form, noiDung: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-pink-400" />
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        {[
          ["diemNoiDung", "Nội dung"],
          ["diemNhanVat", "Nhân vật"],
          ["diemCamXuc", "Cảm xúc"]
        ].map(([k, l]) => (
          <div key={k}>
            <label className="text-sm text-gray-600 block mb-1">
              {l}: <b>{form[k]}/10</b>
            </label>
            <input type="range" min={0} max={10} step={0.5}
              value={form[k]}
              onChange={e => setForm({ ...form, [k]: +e.target.value })}
              className="w-full accent-pink-500" />
          </div>
        ))}
      </div>
      <label className="flex items-center gap-2 mb-4 text-sm">
        <input type="checkbox" checked={form.spoiler}
          onChange={e => setForm({ ...form, spoiler: e.target.checked })} />
        Review có spoil
      </label>
      <button type="submit" disabled={loading}
        className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 disabled:opacity-50">
        {loading ? "Đang gửi..." : "Gửi review"}
      </button>
    </form>
  );
}

function DetailContent({ slug }) {
  // Demo data — thay bằng fetch từ DB
  const truyen = {
    id: "demo-1",
    ten: "Yêu Em Từ Cái Nhìn Đầu Tiên",
    tacGia: "Tác giả ABC",
    moTa: "Câu chuyện tình yêu học đường ngọt ngào giữa hai chàng trai...",
    theLoai: ["Đam mỹ", "Học đường"],
    tags: ["Ngọt", "HE"],
    warning: ["18+"],
    diemTB: 9.2,
    soReview: 12,
    diemNoiDung: 9, diemNhanVat: 9.5, diemCamXuc: 9
  };

  const [reviews, setReviews] = useState([
    {
      id: 1, tieuDe: "Tuyệt vời!", noiDung: "Truyện hay lắm, đọc mà cười suốt.",
      user: { username: "fanbl01" }, diemTong: 9.5, createdAt: new Date().toISOString()
    }
  ]);

  const refresh = () => {
    // Gọi API lấy review mới — demo thêm 1 cái
    setReviews(prev => [
      {
        id: Date.now(),
        tieuDe: "Vừa đọc xong",
        noiDung: "Nhân vật dễ thương, plot ổn.",
        user: { username: "newfan" },
        diemTong: 8.5,
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-56 flex-shrink-0">
          <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center text-5xl">
            📖
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{truyen.ten}</h1>
          <p className="text-gray-600 mb-3">✍️ <b>{truyen.tacGia}</b></p>
          <div className="flex flex-wrap gap-2 mb-4">
            {truyen.theLoai.map(t => (
              <span key={t} className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">{t}</span>
            ))}
            {truyen.tags.map(t => (
              <span key={t} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-6 mb-4">
            <div>
              <div className="text-5xl font-bold text-pink-500">{truyen.diemTB}</div>
              <div className="text-xs text-gray-500">{truyen.soReview} review</div>
            </div>
          </div>
          {truyen.warning.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
              <p className="text-sm">⚠️ <b>Cảnh báo:</b> {truyen.warning.join(", ")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mô tả */}
      <section className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-3">📖 Tóm tắt</h2>
        <p className="text-gray-700">{truyen.moTa}</p>
      </section>

      {/* Điểm chi tiết */}
      <section className="bg-white rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">📊 Đánh giá chi tiết</h2>
        <RatingBar label="Nội dung" value={truyen.diemNoiDung} />
        <RatingBar label="Nhân vật" value={truyen.diemNhanVat} />
        <RatingBar label="Cảm xúc" value={truyen.diemCamXuc} />
      </section>

      {/* Form */}
      <ReviewForm truyenId={truyen.id} onSuccess={refresh} />

      {/* Danh sách review */}
      <section>
        <h2 className="text-xl font-bold mb-4">💬 {reviews.length} review</h2>
        {reviews.map(r => (
          <div key={r.id} className="bg-white rounded-xl p-5 mb-3 shadow-sm">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">
                  {r.user.username[0].toUpperCase()}
                </div>
                <span className="font-semibold text-sm">{r.user.username}</span>
              </div>
              <span className="text-pink-600 font-bold">{r.diemTong}/10</span>
            </div>
            <h3 className="font-bold mb-1">{r.tieuDe}</h3>
            <p className="text-gray-700 text-sm">{r.noiDung}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function Page({ params }) {
  return (
    <Providers>
      <DetailContent slug={params.slug} />
    </Providers>
  );
}
