import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return NextResponse.json(
        { error: "Geçersiz tasarım ID." },
        { status: 400 },
      );
    }

    await prisma.design.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("DELETE /api/designs/[id] error:", error);
    return NextResponse.json({ error: "Tasarım silinemedi." }, { status: 500 });
  }
}
