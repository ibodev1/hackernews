import { ZodError, ZodIssue } from 'zod';

export declare type Result = 'success' | 'error';

export declare type Respond<T = any, P = any[]> = {
  result: Result;
  message?: string;
  paginate?: Paginate<P>;
  data?: T;
  error?: Error | ZodError;
  issues?: ZodIssue[];
};

export type Paginate<T = any[]> = {
  previousPage: number | null;
  nextPage: number | null;
  total: number;
  totalPages: number;
  data: T;
};
