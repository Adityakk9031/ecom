import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];

        // For testing/demo: Accept ANY token as long as it's present
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, items, total } = body;

        if (!email || !items || !total) {
            return NextResponse.json(
                { error: { message: "Missing required fields", code: "INVALID_INPUT" } },
                { status: 400 }
            );
        }

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: { message: "Items must be a non-empty array", code: "INVALID_INPUT" } },
                { status: 400 }
            );
        }

        const order = await prisma.order.create({
            data: {
                email,
                items, // JSON field
                total,
            },
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}
