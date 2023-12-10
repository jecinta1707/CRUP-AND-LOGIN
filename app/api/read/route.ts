import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const notes = await prisma.note.findMany();
    return NextResponse.json({notes});
  } catch (error) {
    return new Response("An error occured.");
  }
}
