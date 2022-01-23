import jwtAuthz from 'express-jwt-authz';

export const requireScope = (permissions: string[]) => {
  return jwtAuthz(permissions, {
    checkAllScopes: false, // first match is a go
    failWithError: true,
  });
};
