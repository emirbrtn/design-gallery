import { getDesignCollection, serializeDesign } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminCookieName, verifyAdminSessionToken } from "@/lib/admin-auth";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminCookieName())?.value;
  return verifyAdminSessionToken(token);
}

export async function GET() {
  try {
    const collection = await getDesignCollection();
    const designs = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json(designs.map(serializeDesign));
  } catch (error) {
    console.error("GET /api/designs error:", error);
    return NextResponse.json(
      { error: "Tasarımlar alınamadı." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, category, image } = body;

    if (!title || !category || !image) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur." },
        { status: 400 },
      );
    }

    const collection = await getDesignCollection();
    const design = {
      title: title.trim(),
      category: category.trim(),
      image: image.trim(),
      createdAt: new Date(),
    };

    const result = await collection.insertOne(design);

    return NextResponse.json(
      serializeDesign({
        _id: result.insertedId,
        ...design,
      }),
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/designs error:", error);
    return NextResponse.json(
      { error: "Tasarım oluşturulamadı." },
      { status: 500 },
    );
  }
}
