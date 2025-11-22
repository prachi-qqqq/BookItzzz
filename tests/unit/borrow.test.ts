// Unit test example: borrow due date calculation

describe('Borrow business logic', () => {
  test('calculates due date 14 days from start', () => {
    const start = new Date('2025-11-22');
    const expected = new Date('2025-12-06');
    const due = new Date(start.getTime() + 14 * 24 * 60 * 60 * 1000);
    expect(due.toISOString().split('T')[0]).toEqual(expected.toISOString().split('T')[0]);
  });

  test('overdue detection', () => {
    const dueAt = new Date('2025-11-20');
    const now = new Date('2025-11-22');
    const isOverdue = dueAt < now;
    expect(isOverdue).toBe(true);
  });
});
