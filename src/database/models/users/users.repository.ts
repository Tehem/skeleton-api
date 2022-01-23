import { Prisma, User } from '@prisma/client';
import { database } from '../../../lib/database';
import logger from '../../../lib/logger';

interface FindAllUsersPaginatedParams {
  limit: number;
  offset: number;
}

/**
 * Find all users with pagination
 */
export async function findAllUsersPaginated(params: FindAllUsersPaginatedParams): Promise<User[]> {
  logger.info('[src/database/models/users/users.repository#findAllItemsPaginated] params', { query: params });

  try {
    return await database.user.findMany({
      skip: params.offset,
      take: params.limit,
    });
  } catch (error) {
    logger.error(`[src/database/models/users/users.repository#findAllItemsPaginated] Error`, {
      error,
      query: params,
    });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Could not find user: ${error.message}`);
    }

    throw error;
  }
}

type CreateUserParams = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Create user
 * @param {CreateUserParams} params
 * @returns {Promise<>}
 */
export async function createUser(params: CreateUserParams): Promise<User> {
  logger.info('[src/database/models/users/users.repository#createUser] params', { query: params });

  try {
    return await database.user.create({
      data: params,
    });
  } catch (error) {
    logger.error(`[src/database/models/users/users.repository#createUser] Error`, {
      error,
      query: params,
    });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Could not create user: ${error.message}`);
    }

    throw error;
  }
}

/**
 * Update user
 */
export async function updateUserById(id: User['id'], updates: Partial<Omit<User, 'id'>>): Promise<User> {
  logger.info('[src/database/models/users/users.repository#updateUserById] Try to update a user', { id, updates });

  try {
    const user = await database.user.update({
      where: {
        id,
      },
      data: updates,
    });

    return user;
  } catch (error) {
    logger.error(`[src/database/models/users/users.repository#updateUserById] Unable to update a user`, {
      error,
      id,
      updates,
    });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(`Could not update user: ${error.message}`);
    }

    throw error;
  }
}

export default { findAllUsersPaginated, createUser, updateUserById };
