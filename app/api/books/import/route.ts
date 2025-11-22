import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

// CSV import endpoint (admin only)
export async function POST(req: Request) {
  try {
    // NOTE: Add proper RBAC check in production
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const text = await file.text();
    const lines = text.split('\n').filter((l) => l.trim());
    const header = lines[0].split(',');

    const imported: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const book = {
        title: values[0],
        subtitle: values[1] || null,
        authors: values[2] ? values[2].split(';') : [],
        description: values[3] || null,
        isbn: values[4] || null,
        publisher: values[5] || null,
        publishedAt: values[6] ? new Date(values[6]) : null,
        genres: values[7] ? values[7].split(';') : [],
        coverUrl: values[8] || null,
        copiesTotal: Number(values[9]) || 1,
        copiesAvailable: Number(values[10]) || 1
      };
      const created = await prisma.book.create({ data: book });
      imported.push(created);
    }

    return NextResponse.json({ imported: imported.length }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
