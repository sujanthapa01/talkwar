import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const authUser = await req.json();

    if (!authUser || !authUser.id || !authUser.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, email, name } = authUser;
    
    await prisma.user.upsert({
      where: { authId: id }, 
      create: {
        authId: id,
        email,
        name,
      },
      update: {
        email,
        name,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upsert Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
