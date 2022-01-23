import { serializeUser } from '../../../../src/routes/v0/users/users.serializer';

describe('user.serializer', () => {
  describe('#serializeUser', () => {
    it('return a new user object', () => {
      const item = {
        id: '2d2ef04f-09a9-40df-a5ae-815298643305',
        name: 'name',
        email: 'test@local.dev',
        createdAt: new Date('2022'),
        updatedAt: new Date('2022'),
      };

      const result = serializeUser(item);

      expect(result).toEqual({
        id: '2d2ef04f-09a9-40df-a5ae-815298643305',
        name: 'name',
        email: 'test@local.dev',
      });
    });
  });
});
