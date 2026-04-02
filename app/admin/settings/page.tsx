"use client";

import { useEffect, useRef, useState } from "react";

export default function SettingsPage() {
  const [logoText, setLogoText] = useState("");
  const [faviconEmoji, setFaviconEmoji] = useState("");
  const [faviconImage, setFaviconImage] = useState<string | null>(null); // base64 data URL
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 当前预览（可能是新选的）
  const [imageError, setImageError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setLogoText(data.logo_text ?? "");
        setFaviconEmoji(data.favicon_emoji ?? "");
        const img = data.favicon_image ?? null;
        setFaviconImage(img);
        setImagePreview(img);
        setLoading(false);
      });
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setImageError("");
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("请选择图片文件（PNG、JPG、SVG、ICO 等）");
      return;
    }

    // 限制原始文件大小 512 KB
    if (file.size > 512 * 1024) {
      setImageError(`文件过大（${(file.size / 1024).toFixed(0)} KB），请上传 512 KB 以内的图片`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setFaviconImage(dataUrl);
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveImage() {
    setFaviconImage(null);
    setImagePreview(null);
    setImageError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);

    const body: Record<string, unknown> = {
      logo_text: logoText,
      favicon_emoji: faviconEmoji,
      favicon_image: faviconImage, // null 表示删除，string 表示更新
    };

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      try {
        const data = await res.json();
        setError(data.error ?? `保存失败（${res.status}）`);
      } catch {
        setError(`保存失败（${res.status}）`);
      }
    }
  }

  // Favicon 当前使用模式
  const usingImage = !!imagePreview;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Site Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">自定义网站外观配置。</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">加载中…</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">

          {/* ── 导航栏 Logo ── */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 space-y-4">
            <h2 className="font-semibold text-zinc-100">导航栏 Logo</h2>
            <div>
              <label className="block text-sm text-zinc-400 mb-1" htmlFor="logo-text">
                Logo 文字
              </label>
              <input
                id="logo-text"
                type="text"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                placeholder="Nagisa/blog"
                maxLength={50}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3">
              <p className="text-xs text-zinc-600 mb-1">预览</p>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {logoText || "Nagisa/blog"}
              </span>
            </div>
          </div>

          {/* ── Favicon ── */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-zinc-100">浏览器标签图标 (Favicon)</h2>
              {usingImage && (
                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  使用图片
                </span>
              )}
            </div>

            {/* 图片上传区域 */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">上传图片</label>
              <div className="flex items-center gap-3">
                {/* 预览框 */}
                <div
                  className="w-12 h-12 rounded-md border border-zinc-700 bg-zinc-950 flex items-center justify-center shrink-0 overflow-hidden"
                >
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt="favicon preview" className="w-full h-full object-contain" />
                  ) : (
                    <div
                      style={{
                        width: 32, height: 32, background: "#09090b", borderRadius: 4,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, color: "#34d399",
                      }}
                    >
                      {faviconEmoji || "◆"}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-zinc-300 hover:border-zinc-400 hover:text-zinc-100 transition-colors"
                  >
                    选择图片…
                  </button>
                  {usingImage && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="ml-2 rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-500 hover:border-red-800 hover:text-red-400 transition-colors"
                    >
                      移除图片
                    </button>
                  )}
                  <p className="text-xs text-zinc-600">
                    支持 PNG、JPG、SVG、ICO，建议使用正方形图片，大小 ≤ 512 KB
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {imageError && (
                <p className="mt-2 text-sm text-red-400">{imageError}</p>
              )}
            </div>

            {/* Emoji 回退（无图片时使用） */}
            <div className={usingImage ? "opacity-40 pointer-events-none" : ""}>
              <label className="block text-sm text-zinc-400 mb-1" htmlFor="favicon-emoji">
                Emoji / 字符{usingImage ? "（图片优先，此项暂不生效）" : "（无图片时使用）"}
              </label>
              <input
                id="favicon-emoji"
                type="text"
                value={faviconEmoji}
                onChange={(e) => setFaviconEmoji(e.target.value)}
                placeholder="◆"
                maxLength={2}
                disabled={usingImage}
                className="w-40 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none disabled:opacity-50"
              />
              <p className="mt-1 text-xs text-zinc-600">
                例如：🌸 ⚡ 🔐 N
              </p>
            </div>

            <p className="text-xs text-zinc-600">
              保存后约 1 小时内生效（缓存）。可按 Ctrl+Shift+R 强制刷新立即查看。
            </p>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={saving || !logoText.trim() || (!faviconEmoji.trim() && !faviconImage)}
            className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "保存中…" : saved ? "已保存 ✓" : "保存所有设置"}
          </button>
        </form>
      )}
    </div>
  );
}
