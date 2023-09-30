import { Paginate } from "../types.ts";

const paginate = <T>(items: T[] | null, page = 1, perPage = 10): Paginate<T> | null => {
  if (Array.isArray(items)) {
    const offset = perPage * (page - 1);
    const totalPages = Math.ceil(items.length / perPage);
    const paginatedItems = items.slice(offset, perPage * page);

    return {
      previousPage: page - 1 ? page - 1 : null,
      nextPage: (totalPages > page) ? page + 1 : null,
      total: items.length,
      totalPages: totalPages,
      data: paginatedItems as T[],
    };
  }

  return null;
};

export { paginate };
