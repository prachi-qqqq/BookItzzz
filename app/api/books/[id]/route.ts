import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const ratingAgg = await prisma.review.aggregate({
    where: { bookId: id },
    _avg: { rating: true },
    _count: { rating: true }
  });
  return NextResponse.json({ ...book, aggregatedRating: ratingAgg });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const body = await req.json();
  const updated = await prisma.book.update({ where: { id }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  // soft delete
  await prisma.book.update({ where: { id }, data: { isDeleted: true } });
  return NextResponse.json({ ok: true });
}
