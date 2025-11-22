import prisma from '../lib/prisma';
import redis from '../lib/rateLimiter';

async function markOverdueAndNotify() {
  console.log('Running worker: overdue detection');
  const now = new Date();
  const overdue = await prisma.borrow.findMany({ where: { dueAt: { lt: now }, returnedAt: null } });
  for (const b of overdue) {
    await prisma.borrow.update({ where: { id: b.id }, data: { status: 'OVERDUE' } });
    await prisma.auditLog.create({ data: { action: 'mark_overdue', entity: 'Borrow', entityId: b.id, data: {} } });
  }
  console.log(`Marked ${overdue.length} borrows overdue`);
}

async function main() {
  await markOverdueAndNotify();
  await prisma.$disconnect();
  await redis.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
