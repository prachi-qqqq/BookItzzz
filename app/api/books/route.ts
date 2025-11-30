import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rateLimiter';

const QuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  q: z.string().optional(),
  genre: z.string().optional()
});

export async function GET(req: Request) {
  const rl = await checkRateLimit('public', 200, 60);
  if (!rl.ok) return new Response('Rate limit exceeded', { status: 429 });

  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const parsed = QuerySchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid query' }, { status: 400 });

  const page = Number(parsed.data.page || 1);
  const limit = Math.min(50, Number(parsed.data.limit || 20));
  const skip = (page - 1) * limit;

  const where: any = { isDeleted: false };
  if (parsed.data.genre) {
    where.genres = { has: parsed.data.genre };
  }
  if (parsed.data.q) {
    where.OR = [
      { title: { contains: parsed.data.q, mode: 'insensitive' } },
      { authors: { has: parsed.data.q } },
      { isbn: { contains: parsed.data.q } }
    ];
  }

  const [items, total] = await Promise.all([
    prisma.book.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.book.count({ where })
  ]);

  return NextResponse.json({ data: items, meta: { total, page, limit } });
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = {
      title: json.title,
      subtitle: json.subtitle,
      authors: json.authors || [],
      description: json.description,
      isbn: json.isbn,
      publisher: json.publisher,
      publishedAt: json.publishedAt ? new Date(json.publishedAt) : null,
      genres: json.genres || [],
      coverUrl: json.coverUrl,
      copiesTotal: json.copiesTotal || 1,
      copiesAvailable: json.copiesAvailable ?? json.copiesTotal ?? 1
    };
    // NOTE: RBAC should be enforced via middleware in real app
    const book = await prisma.book.create({ data });
    return NextResponse.json(book, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
