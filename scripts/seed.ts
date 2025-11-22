import prisma from '../lib/prisma';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

async function main() {
  console.log('Running seed...');
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || 'admin@example.com';

  const hashed = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      role: 'ADMIN',
      password: hashed
    }
  });

  const librarian = await prisma.user.upsert({
    where: { email: 'librarian@example.com' },
    update: {},
    create: {
      email: 'librarian@example.com',
      name: 'Head Librarian',
      role: 'LIBRARIAN',
      password: hashed
    }
  });

  // Create members
  for (let i = 0; i < 10; i++) {
    await prisma.user.upsert({
      where: { email: `member${i}@example.com` },
      update: {},
      create: {
        email: `member${i}@example.com`,
        name: faker.person.fullName(),
        role: 'MEMBER',
        password: hashed
      }
    });
  }

  // Create ~200 books
  const genres = ['Fiction', 'Nonfiction', 'Sci-Fi', 'Fantasy', 'History', 'Biography'];
  const books: any[] = [];
  for (let i = 0; i < 200; i++) {
    books.push({
      title: faker.lorem.sentence({ min: 2, max: 6 }),
      subtitle: faker.lorem.sentence({ min: 3, max: 8 }),
      authors: [faker.person.fullName()],
      description: faker.lorem.paragraphs(2),
      isbn: faker.string.numeric(13),
      publisher: faker.company.name(),
      publishedAt: faker.date.past({ years: 20 }),
      genres: [faker.helpers.arrayElement(genres)],
      coverUrl: `https://images.unsplash.com/photo-${faker.string.numeric(6)}`,
      copiesTotal: faker.number.int({ min: 1, max: 5 }),
      copiesAvailable: faker.number.int({ min: 0, max: 5 })
    });
  }

  console.log('Inserting books...');
  for (const b of books) {
    await prisma.book.create({ data: b });
  }

  console.log('Seeding done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
