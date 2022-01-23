import { User } from '@prisma/client';

type SerializeUser = Omit<User, 'createdAt' | 'updatedAt'>

/**
 * Serialize User
 */
export function serializeUser(user: User): SerializeUser {
  const { createdAt, updatedAt, ...rest } = user;

  return rest;
}
