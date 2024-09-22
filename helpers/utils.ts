import { Paginate } from '../types/index.ts';

const paginate = <T = any[]>(
  items: T[],
  page = 1,
  perPage = 10,
): Paginate<T> => {
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
