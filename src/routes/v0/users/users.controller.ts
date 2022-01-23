import { Request, Response } from 'express';
import { z } from 'zod';
import { processRequest, processRequestBody, processRequestQuery, TypedRequestQuery } from 'zod-express-middleware';

import { createUser, findAllUsersPaginated, updateUserById } from '../../../database/models/users/users.repository';

import logger from '../../../lib/logger';
import * as preprocess from '../../../utils/zod-preprocessors';
import { serializeUser } from './users.serializer';

const getUsersPaginatedSchema = z.object({
  limit: preprocess.number(z.number().optional().default(10)),
  offset: preprocess.number(z.number().optional().default(0)),
});

export const getUsersPaginatedValidator = processRequestQuery(getUsersPaginatedSchema);

/**
 * Get users
 * @param {TypedRequestQuery<typeof getUsersPaginatedSchema>} req
 * @param {e.Response} res
 * @returns {Promise<e.Response>}
 */
export async function getUsersPaginated(
  req: TypedRequestQuery<typeof getUsersPaginatedSchema>,
  res: Response,
): Promise<Response> {
  logger.info('[users.controller#getUsersPaginated]', {
    query: req.query,
    user: req.user,
  });

  const { limit, offset } = req.query;

  try {
    const users = await findAllUsersPaginated({ limit, offset });

    logger.info('[users.controller#getUsersPaginated] users successfully retrieved', {
      result: users,
    });

    return res.status(200).json({ users: users.map(serializeUser) });
  } catch (error) {
    logger.error('[users.controller#getUsersPaginated] Error getting users', {
      error,
      query: req.query,
    });

    return res.status(500).json({ error: 'Error getting users' });
  }
}

const bodyPostUserSchema = z.object({
  name: z.string().nullable().default(null),
  email: z.string(),
});

type BodyPostUser = z.infer<typeof bodyPostUserSchema>;

export const postUserValidator = processRequestBody(bodyPostUserSchema);

/**
 * Post User
 */
export async function postUser(req: Request<unknown, unknown, BodyPostUser>, res: Response): Promise<Response> {
  logger.info('[users.controller#postUser] Starting to create an user', {
    body: req.body,
  });

  try {
    const { name, email } = req.body;
    const user = await createUser({ name, email });

    logger.info('[users.controller#postUser] User successfully created', {
      user,
    });

    return res.status(200).json({ user: serializeUser(user) });
  } catch (error) {
    logger.error('[users.controller#postUser] Error creating user', {
      error,
      body: req.body,
    });

    return res.status(500).json({ error: 'Error creating user' });
  }
}

const paramsPatchUserSchema = z.object({
  id: z.string(),
});

type ParamsPatchUserSchema = z.infer<typeof paramsPatchUserSchema>;

const bodyPatchUserSchema = z
  .object({
    name: z.string().nullable().default(null),
    email: z.string().optional(),
  })
  .refine((data) => data.email || data.name, {
    path: ['name', 'email'],
    message: 'name or email must be provided',
  });

type BodyPatchUserSchema = z.infer<typeof bodyPatchUserSchema>;

export const patchUserValidator = processRequest({
  params: paramsPatchUserSchema,
  body: bodyPatchUserSchema,
});

/**
 * patch User
 */
export async function patchUser(
  req: Request<ParamsPatchUserSchema, unknown, BodyPatchUserSchema>,
  res: Response,
): Promise<Response> {
  const { id } = req.params;

  logger.info('[users.controller#patchUser] Starting to update an user', {
    body: req.body,
    id,
  });

  try {
    const updatedUser = await updateUserById(id, req.body);

    logger.info('[users.controller#patchUser] User successfully updated', {
      updatedUser,
      id,
    });

    return res.status(200).json({ user: serializeUser(updatedUser) });
  } catch (error) {
    logger.error('[users.controller#patchUser] Error updating user', {
      error,
      body: req.body,
      id,
    });

    return res.status(500).json({ error: 'Error updating user' });
  }
}
