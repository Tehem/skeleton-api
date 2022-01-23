import {
  createUser,
  findAllUsersPaginated,
  updateUserById,
} from '../../../../src/database/models/users/users.repository';
import { database } from '../../../../src/lib/database';
import { Prisma } from '@prisma/client';

describe('users.repository.ts', () => {
  describe('#findAllUsersPaginated', () => {
    beforeAll(async () => {
      await database.user.deleteMany({ where: {} });
      await database.user.create({
        data: {
          name: 'user',
          email: 'test@local.dev',
        },
      });
    });

    it('returns users', async () => {
      const params = {
        limit: 1,
        offset: 0,
      };

      const users = await findAllUsersPaginated(params);

      expect(users).toMatchObject([
        {
          id: expect.any(String),
          name: 'user',
          email: 'test@local.dev',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ]);
    });

    it('returns empty array when users not found', async () => {
      const params = {
        limit: 1,
        offset: 1,
      };

      const users = await findAllUsersPaginated(params);

      expect(users).toMatchObject([]);
    });

    it('throws descriptive error if database throws', async () => {
      database.user.findMany = jest.fn().mockImplementation(() => {
        throw new Prisma.PrismaClientKnownRequestError('oups', '1234', '1');
      });
      
      let error = null;
      try {
        await findAllUsersPaginated({ limit: 10, offset: 0 });
      } catch (err) {
        error = err;
      }

      expect(error).toEqual(new Error('Could not find user: oups'));
    });

    it('throws the error unchanged if unknown error from database', async () => {
      database.user.findMany = jest.fn().mockImplementation(() => {
        throw new Error('oups');
      });

      let error = null;
      try {
        await findAllUsersPaginated({ limit: 10, offset: 0 });
      } catch (err) {
        error = err;
      }

      expect(error).toEqual(new Error('oups'));
    });
  });

  describe('#createUser', () => {
    beforeEach(async () => {
      await database.user.deleteMany({ where: {} });
    });

    it('creates user will all data', async () => {
      const params = {
        name: 'name',
        email: 'test2@local.dev',
      };

      const user = await createUser(params);

      expect(user).toEqual({
        id: expect.any(String),
        name: 'name',
        email: 'test2@local.dev',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('creates user only with email', async () => {
      const params = {
        email: 'test2@local.dev',
        name: '',
      };

      const user = await createUser(params);

      expect(user).toEqual({
        id: expect.any(String),
        name: '',
        email: 'test2@local.dev',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe('#updateUserById', () => {
    beforeEach(async () => {
      await database.user.deleteMany({ where: {} });
      await database.user.create({
        data: {
          id: '7d18e179-c4fb-4686-b99c-f46ce27cfa7a',
          name: 'user',
          email: 'test@local.dev',
        },
      });
    });

    it('updates correctly an user', async () => {
      const id = '7d18e179-c4fb-4686-b99c-f46ce27cfa7a';
      const params = {
        name: 'updated',
        email: 'updated@local.dev',
      };

      const user = await updateUserById(id, params);

      expect(user).toMatchObject({
        id: '7d18e179-c4fb-4686-b99c-f46ce27cfa7a',
        name: 'updated',
        email: 'updated@local.dev',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('rejects an error when id does not exist', () => {
      const id = 'FAKE-c4fb-4686-b99c-f46ce27cfa7a';
      const params = {
        name: 'updated',
        email: 'updated@local.dev',
      };

      expect(updateUserById(id, params)).rejects.toThrow();
    });
  });
});
