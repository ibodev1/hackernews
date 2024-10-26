import type { PaginateValues } from '../routes/schema.ts';
import { Paginate } from '../types/index.ts';

const paginate = <T = any[]>(
  items: T[],
  paginateValues: PaginateValues,
): Paginate<T[]> => {
  const page = Number.parseInt(paginateValues?.page ?? '1');
  const perPage = Number.parseInt(paginateValues?.limit ?? '30');

  const offset = perPage * (page - 1);
  const totalPages = Math.ceil(items.length / perPage);
  const paginatedItems = items.slice(offset, offset + perPage);

  return {
    previousPage: page > 1 ? page - 1 : null,
    nextPage: totalPages > page ? page + 1 : null,
    total: items.length,
    totalPages,
    data: paginatedItems,
  };
};

export { paginate };
