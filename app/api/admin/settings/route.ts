import { getSiteSetting, setSiteSetting } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

// 上传图片大小上限：512 KB（base64 后约 700 KB 字符串）
const MAX_IMAGE_BYTES = 512 * 1024;

export async function GET() {
  try {
    const [logoText, faviconEmoji, faviconImage] = await Promise.all([
      getSiteSetting("logo_text"),
      getSiteSetting("favicon_emoji"),
      getSiteSetting("favicon_image"),
    ]);
    return Response.json({
      logo_text: logoText ?? "Nagisa/blog",
      favicon_emoji: faviconEmoji ?? "◆",
      favicon_image: faviconImage ?? null,
    });
  } catch {
    return Response.json({ logo_text: "Nagisa/blog", favicon_emoji: "◆", favicon_image: null });
  }
}

export async function PUT(request: Request) {
  try {
    const denied = await requireAdmin();
    if (denied) return denied;

    const body = await request.json();
    const updates: Promise<void>[] = [];

    if (typeof body.logo_text === "string") {
      const val = body.logo_text.trim();
      if (!val) return Response.json({ error: "logo_text cannot be empty" }, { status: 400 });
      updates.push(setSiteSetting("logo_text", val));
    }

    if (typeof body.favicon_emoji === "string") {
      const val = body.favicon_emoji.trim();
      if (!val) return Response.json({ error: "favicon_emoji cannot be empty" }, { status: 400 });
      updates.push(setSiteSetting("favicon_emoji", val));
    }

    // favicon_image: base64 data URL 或 null（null 表示删除图片，回退到 emoji）
    if ("favicon_image" in body) {
      if (body.favicon_image === null) {
        updates.push(setSiteSetting("favicon_image", ""));
      } else if (typeof body.favicon_image === "string") {
        const dataUrl = body.favicon_image;
        if (!dataUrl.startsWith("data:image/")) {
          return Response.json({ error: "favicon_image must be a valid image data URL" }, { status: 400 });
        }
        // 校验大小（base64 字符串长度 * 0.75 ≈ 原始字节数）
        const approxBytes = Math.ceil((dataUrl.length * 3) / 4);
        if (approxBytes > MAX_IMAGE_BYTES) {
          return Response.json({ error: "图片过大，请上传 512 KB 以内的图片" }, { status: 400 });
        }
        updates.push(setSiteSetting("favicon_image", dataUrl));
      }
    }

    if (updates.length === 0) {
      return Response.json({ error: "No valid fields to update" }, { status: 400 });
    }

    await Promise.all(updates);

    const [logoText, faviconEmoji, faviconImage] = await Promise.all([
      getSiteSetting("logo_text"),
      getSiteSetting("favicon_emoji"),
      getSiteSetting("favicon_image"),
    ]);

    return Response.json({
      logo_text: logoText ?? "Nagisa/blog",
      favicon_emoji: faviconEmoji ?? "◆",
      favicon_image: faviconImage || null,
    });
  } catch (err) {
    console.error("[settings PUT]", err);
    return Response.json({ error: "服务器内部错误，请稍后重试" }, { status: 500 });
  }
}
