import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, bookId } = body;
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    const count = await prisma.reservation.count({ where: { bookId, status: 'ACTIVE' } });
    const reservation = await prisma.reservation.create({
      data: { userId, bookId, status: 'ACTIVE', position: count + 1 }
    });
    return NextResponse.json(reservation, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
