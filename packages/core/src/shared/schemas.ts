import { z } from 'zod';

export const IdSchema = z.union([z.string(), z.number()]).transform((value) => String(value));

export type Id = string;
