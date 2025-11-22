import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  const totalBooks = await prisma.book.count({ where: { isDeleted: false } });
  const activeBorrows = await prisma.borrow.count({ where: { status: 'BORROWED' } });
  const overdueCount = await prisma.borrow.count({ where: { status: 'OVERDUE' } });
  const totalUsers = await prisma.user.count();
  return NextResponse.json({
    totalBooks,
    activeBorrows,
    overdueCount,
    totalUsers
  });
}

export async function POST() {
  // Admin-only dev helper: trigger seed in prod not recommended
  return NextResponse.json({ error: 'Use seed script locally' }, { status: 403 });
}
