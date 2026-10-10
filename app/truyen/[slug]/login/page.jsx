"use client";
import { useState } from "react";
import { signIn, SessionProvider } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") === "register" ? "register" : "login");
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false
    });
    setLoading(false);
    if (res?.error) {
      setError("Sai email hoặc mật khẩu");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth?action=register", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Có lỗi xảy ra");
      return;
    }
    // Đăng ký xong → tự đăng nhập
    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false
    });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <Link href="/" className="block text-center mb-6">
          <span className="text-3xl">🌸</span>
          <h1 className="text-2xl font-bold text-pink-600 mt-2">BL Review</h1>
        </Link>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => { setTab("login"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
              tab === "login" ? "bg-white shadow text-pink-600" : "text-gray-500"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => { setTab("register"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
              tab === "register" ? "bg-white shadow text-pink-600" : "text-gray-500"
            }`}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={tab === "login" ? handleLogin : handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-pink-400"
          />

          {tab === "register" && (
            <input
              type="text"
              placeholder="Username"
              required
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-pink-400"
            />
          )}

          <input
            type="password"
            placeholder="Mật khẩu"
            required
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-pink-400"
          />

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2.5 rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : tab === "login" ? "Đăng nhập" : "Tạo tài khoản"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {tab === "login" ? (
            <>Chưa có tài khoản?{" "}
              <button onClick={() => setTab("register")} className="text-pink-600 font-semibold">
                Đăng ký
              </button>
            </>
          ) : (
            <>Đã có tài khoản?{" "}
              <button onClick={() => setTab("login")} className="text-pink-600 font-semibold">
                Đăng nhập
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Providers>
      <LoginContent />
    </Providers>
  );
}
