import { NextFunction, Request, Response } from 'express';

export const requireAuth = jest.fn((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    aud: 'https://local.dev',
    gty: 'client-credentials',
    iss: 'https://auth.local.dev/',
    scope: 'admin:root',
  };
  if (typeof next === 'function') {
    next();
  }
});
