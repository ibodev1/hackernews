import { ZodIssue } from 'zod';

export declare type Result = 'success' | 'error';

export declare type Respond<T = any> = {
  result: Result;
  message?: string;
} & T;

export declare type ResponseObject = Respond<ResponseExtra>;

export type ResponseExtra = {
  issues?: ZodIssue[];
};

export type Paginate<T = unknown[]> = {
  previousPage: number | null;
  nextPage: number | null;
  total: number;
  totalPages: number;
  data: T[];
};
