import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id: bookId } = params;
    const body = await req.json();
    const { userId, rating, content } = body;
    if (!userId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
    const review = await prisma.review.create({ data: { bookId, userId, rating, content } });
    return NextResponse.json(review, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id: bookId } = params;
  const reviews = await prisma.review.findMany({ where: { bookId }, include: { user: true }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ data: reviews });
}
