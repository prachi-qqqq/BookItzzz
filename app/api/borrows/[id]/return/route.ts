import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const borrow = await prisma.borrow.findUnique({ where: { id }, include: { book: true } });
  if (!borrow) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await prisma.borrow.update({ where: { id }, data: { returnedAt: new Date(), status: 'RETURNED' } });
  await prisma.book.update({ where: { id: borrow.bookId }, data: { copiesAvailable: { increment: 1 } } });
  return NextResponse.json({ ok: true });
}
