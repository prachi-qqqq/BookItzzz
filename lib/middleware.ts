import { NextResponse } from 'next/server';

export type Role = 'ADMIN' | 'LIBRARIAN' | 'MEMBER' | 'GUEST';

export function requireRole(allowedRoles: Role[]) {
  return async (req: Request, handler: Function) => {
    // NOTE: In production, extract session from NextAuth and check user role
    // For now, this is a skeleton showing the pattern
    const session: any = {}; // await getServerSession(req, res, authOptions);
    const userRole: Role = session?.user?.role || 'GUEST';

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return handler(req);
  };
}

export function withAuth(handler: Function, allowedRoles: Role[] = ['MEMBER', 'LIBRARIAN', 'ADMIN']) {
  return async (req: Request) => {
    // Extract session and validate
    // Placeholder logic
    return handler(req);
  };
}
