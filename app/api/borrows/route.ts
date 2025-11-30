import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, bookId } = body;
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    if (book.copiesAvailable <= 0) {
      return NextResponse.json({ error: 'No copies available' }, { status: 400 });
    }
    const dueAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days
    const borrow = await prisma.borrow.create({
      data: { userId, bookId, dueAt, status: 'BORROWED' }
    });
    await prisma.book.update({ where: { id: bookId }, data: { copiesAvailable: { decrement: 1 } } });
    return NextResponse.json(borrow, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const borrows = await prisma.borrow.findMany({ include: { user: true, book: true }, orderBy: { startedAt: 'desc' } });
  return NextResponse.json({ data: borrows });
}
