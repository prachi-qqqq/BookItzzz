// API response helpers

export function successResponse<T>(data: T, status = 200) {
  return Response.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

export function paginatedResponse<T>(items: T[], total: number, page: number, limit: number) {
  return Response.json({
    data: items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }
  });
}

// Validation helper with Zod
import { z, ZodSchema } from 'zod';

export async function validateBody<T>(req: Request, schema: ZodSchema<T>): Promise<T | null> {
  try {
    const body = await req.json();
    return schema.parse(body) as T;
  } catch (err) {
    return null;
  }
}

// Extract user from session (placeholder)
export async function getCurrentUser(req: Request): Promise<{ id: string; role: string } | null> {
  // In real implementation, extract from NextAuth session
  // For now, return null (unauthenticated)
  return null;
}
