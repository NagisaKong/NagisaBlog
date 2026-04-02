import { ImageResponse } from "next/og";
import { getSiteSetting } from "@/lib/db";

export const size = { width: 32, height: 32 };
// 每小时重新生成一次，使修改在合理时间内生效
export const revalidate = 3600;

export default async function Icon() {
  let faviconImage: string | null = null;
  let emoji = "◆";

  try {
    [faviconImage, emoji] = await Promise.all([
      getSiteSetting("favicon_image"),
      getSiteSetting("favicon_emoji").then((v) => v ?? "◆"),
    ]);
  } catch {
    // DB unavailable — use defaults
  }

  // 优先使用上传的图片（base64 data URL）
  if (faviconImage) {
    // data URL 格式: "data:<mimeType>;base64,<data>"
    const match = faviconImage.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const mimeType = match[1];
      const buffer = Buffer.from(match[2], "base64");
      return new Response(buffer, {
        headers: { "Content-Type": mimeType },
      });
    }
  }

  // 回退：用 emoji 生成图标
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#34d399",
          borderRadius: "4px",
        }}
      >
        {emoji}
      </div>
    ),
    { ...size }
  );
}
