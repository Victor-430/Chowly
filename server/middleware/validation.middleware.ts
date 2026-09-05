import type { RequestHandler } from 'express';
import { invalid } from '../utils/errors.js';

export const requireString = (value: unknown, name: string, max = 500) => {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw invalid(`${name} is required and must be at most ${max} characters`);
  return value.trim();
};

export const requirePositiveInteger = (value: unknown, name: string, max = 100) => {
  if (!Number.isInteger(value) || (value as number) < 1 || (value as number) > max) throw invalid(`${name} must be an integer between 1 and ${max}`);
  return value as number;
};

export const validate = (validator: (body: unknown) => void): RequestHandler => (req, _res, next) => {
  try { validator(req.body); next(); } catch (error) { next(error); }
};
