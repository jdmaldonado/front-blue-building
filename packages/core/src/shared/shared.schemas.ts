import { z } from 'zod';

export const IdSchema = z.union([z.string(), z.number()]).transform((value) => String(value));

// The router turns `?document=123` into a number. Text read from the URL takes both.
export const SearchTextSchema = z.union([z.string(), z.number()]).transform((value) => String(value));

export type Id = string;
