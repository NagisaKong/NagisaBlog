import { NextResponse } from "next/server";
import { getPostLikes, incrementPostLikes } from "@/lib/db";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const likes = await getPostLikes(slug);
  return NextResponse.json({ likes });
}

export async function POST(_req: Request, { params }: Params) {
  const { slug } = await params;
  const likes = await incrementPostLikes(slug);
  return NextResponse.json({ likes });
}
