import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { responses } from "@/db/schema";
import { questions } from "@/lib/disc";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const required = [body.firstName, body.lastName, body.phone, body.role, body.email];
    const invalid =
      required.some((value) => typeof value !== "string" || !value.trim()) ||
      !Array.isArray(body.answers) ||
      body.answers.length !== questions.length ||
      body.answers.some((value: unknown) => !Number.isInteger(value) || Number(value) < 1 || Number(value) > 5);

    if (invalid) return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });

    await getDb().insert(responses).values({
      id: crypto.randomUUID(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      phone: body.phone.trim(),
      role: body.role.trim(),
      email: body.email.trim(),
      answers: JSON.stringify(body.answers),
      scores: JSON.stringify(body.scores),
      dominant: body.dominant,
      createdAt: Date.now(),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Falha ao registrar" }, { status: 500 });
  }
}
