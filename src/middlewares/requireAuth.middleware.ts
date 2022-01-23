import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import config from '../config';

export const requireAuth = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${config.auth0.domain}/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: config.auth0.audience,
  issuer: `https://${config.auth0.domain}/`,
  algorithms: ['RS256'],
});

// ℹ️ : the decoded token will be available in req.user
