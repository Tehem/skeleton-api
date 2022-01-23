import request from 'supertest';
import app from '../../../../src/app';
import { database } from '../../../../src/lib/database';

jest.mock('../../../../src/middlewares/requireAuth.middleware');
jest.mock('../../../../src/middlewares/requireScope.middleware');

describe('users.controller', () => {
  describe('GET /api/v0/users #getUsersPaginated', () => {
    beforeAll(async () => {
      await database.user.deleteMany({ where: {} });
      await database.user.create({
        data: {
          name: 'user',
          email: 'test@local.dev',
        },
      });
    });

    it('returns 400 when offset is not valid', async () => {
      const { status } = await request(app).get('/api/v0/users').query({ offset: 'invalid' });

      expect(status).toBe(400);
    });

    it('returns 400 when limit is not valid', async () => {
      const { status } = await request(app).get('/api/v0/users').query({ limit: 'invalid' });

      expect(status).toBe(400);
    });

    it('returns 200 with serialized users', async () => {
      const { status, body } = await request(app).get('/api/v0/users').query({});

      expect(status).toBe(200);
      expect(body).toMatchObject({
        users: [
          {
            id: expect.any(String),
            name: 'user',
            email: 'test@local.dev',
          },
        ],
      });
    });
  });

  describe('POST /api/v0/users #postUser', () => {
    beforeEach(async () => {
      await database.user.deleteMany({ where: {} });
    });

    it('returns 400 when email is not provided', async () => {
      const { status, body } = await request(app).post('/api/v0/users').send({});

      expect(status).toBe(400);
      expect(body).toEqual([
        {
          type: 'Body',
          errors: {
            issues: [
              {
                code: 'invalid_type',
                expected: 'string',
                received: 'undefined',
                path: ['email'],
                message: 'Required',
              },
            ],
            name: 'ZodError',
          },
        },
      ]);
    });

    it('returns 200 with serialized user created when name is not provided', async () => {
      const { status, body } = await request(app).post('/api/v0/users').send({ email: 'test@local.dev' });

      expect(status).toBe(200);
      expect(body).toEqual({
        user: {
          id: expect.any(String),
          email: 'test@local.dev',
          name: null,
        },
      });
    });

    it('returns 200 with serialized user created', async () => {
      const { status, body } = await request(app).post('/api/v0/users').send({ name: 'name', email: 'test@local.dev' });

      expect(status).toBe(200);
      expect(body).toEqual({
        user: {
          id: expect.any(String),
          name: 'name',
          email: 'test@local.dev',
        },
      });
    });
  });

  describe('PATCH /api/v0/users #patchUser', () => {
    beforeEach(async () => {
      await database.user.deleteMany({ where: {} });
      await database.user.create({
        data: {
          id: '7d18e179-c4fb-4686-b99c-f46ce27cfa7a',
          name: 'name',
          email: 'test@local.dev',
        },
      });
    });

    it('returns 400 when body is an empty object', async () => {
      const { status, body } = await request(app).patch('/api/v0/users/7d18e179-c4fb-4686-b99c-f46ce27cfa7a').send({});

      expect(status).toBe(400);
      expect(body).toEqual([
        {
          type: 'Body',
          errors: {
            issues: [
              {
                code: 'custom',
                path: ['name', 'email'],
                message: 'name or email must be provided',
              },
            ],
            name: 'ZodError',
          },
        },
      ]);
    });

    it('returns the serialized updated user - name parameter', async () => {
      const { status, body } = await request(app)
        .patch('/api/v0/users/7d18e179-c4fb-4686-b99c-f46ce27cfa7a')
        .send({ name: 'updated' });

      expect(status).toBe(200);
      expect(body).toMatchObject({
        user: {
          id: '7d18e179-c4fb-4686-b99c-f46ce27cfa7a',
          name: 'updated',
          email: 'test@local.dev',
        },
      });
    });

    it('returns the serialized updated user - email parameter', async () => {
      const { status, body } = await request(app)
        .patch('/api/v0/users/7d18e179-c4fb-4686-b99c-f46ce27cfa7a')
        .send({ email: 'updated@local.dev' });

      expect(status).toBe(200);
      expect(body).toMatchObject({
        user: {
          id: '7d18e179-c4fb-4686-b99c-f46ce27cfa7a',
          name: null,
          email: 'updated@local.dev',
        },
      });
    });

    it('returns the serialized updated user - all parameters', async () => {
      const { status, body } = await request(app)
        .patch('/api/v0/users/7d18e179-c4fb-4686-b99c-f46ce27cfa7a')
        .send({ name: 'updated', email: 'updated@local.dev' });

      expect(status).toBe(200);
      expect(body).toMatchObject({
        user: {
          id: '7d18e179-c4fb-4686-b99c-f46ce27cfa7a',
          name: 'updated',
          email: 'updated@local.dev',
        },
      });
    });
  });
});
