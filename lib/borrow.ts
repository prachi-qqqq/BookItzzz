// Business logic for borrow operations

export function calculateDueDate(startDate: Date, daysToAdd = 14): Date {
  const due = new Date(startDate);
  due.setDate(due.getDate() + daysToAdd);
  return due;
}

export function isOverdue(dueDate: Date, returnedAt: Date | null): boolean {
  if (returnedAt) return false;
  return new Date() > dueDate;
}

export function calculateFine(dueDate: Date, returnedAt: Date | null, finePerDay = 50): number {
  if (!returnedAt) {
    const now = new Date();
    if (now <= dueDate) return 0;
    const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysOverdue * finePerDay;
  }
  if (returnedAt <= dueDate) return 0;
  const daysOverdue = Math.floor((returnedAt.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysOverdue * finePerDay;
}

// Reservation queue logic
export function getNextReservationPosition(currentMax: number): number {
  return currentMax + 1;
}

export async function fulfillNextReservation(bookId: string, prisma: any) {
  const next = await prisma.reservation.findFirst({
    where: { bookId, status: 'ACTIVE' },
    orderBy: { position: 'asc' }
  });
  if (next) {
    await prisma.reservation.update({ where: { id: next.id }, data: { status: 'FULFILLED' } });
    return next;
  }
  return null;
}
