import { getDesignCollection } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getAdminCookieName, verifyAdminSessionToken } from "@/lib/admin-auth";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAdminCookieName())?.value;
  return verifyAdminSessionToken(token);
}

export async function DELETE(request, context) {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
  }

  try {
    const params = await context.params;
    const id = params.id;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Geçersiz tasarım ID." },
        { status: 400 },
      );
    }

    const collection = await getDesignCollection();
    const result = await collection.deleteOne({
      _id: new ObjectId(id),
    });

    if (!result.deletedCount) {
      return NextResponse.json({ error: "Tasarım bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("DELETE /api/designs/[id] error:", error);
    return NextResponse.json({ error: "Tasarım silinemedi." }, { status: 500 });
  }
}
