import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prismaClient"
export async function POST(req: NextRequest, res: NextResponse) {
    const { message, authid } = await req.json()


    if (!message || !authid) {
        return NextResponse.json({ error: "missing userId or chat" }, { status: 400 });
    }
    if (!Array.isArray(message)) {
        return NextResponse.json({ error: "message should be an array" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: {
            authId: authid,
        },
    })
    try {
        const bookMark = await prisma.bookmark.create({
            data: {
                messeges: message.map((msg: string[]) => JSON.stringify(msg)),
                user: {
                    connect: {
                        id: user?.id,
                    }
                }
            }
        })

        return NextResponse.json({ message: "Bookmark created successfully", bookMark }, { status: 200 },)

    } catch (error) {
        console.error("Error creating bookmark:", error);
        return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 },);
    }

}

