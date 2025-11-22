import { getServerSession as nextAuthGetServerSession } from 'next-auth/next';
import NextAuth from 'next-auth';
import { authOptions } from '../pages/api/auth/[...nextauth]';

export async function getServerSession(req: any, res: any) {
  // wrapper for pages + app router compatibility
  return await nextAuthGetServerSession(req, res, authOptions as any);
}
