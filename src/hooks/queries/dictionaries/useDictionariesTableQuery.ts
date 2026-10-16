import { dictionariesConfig } from '@/configs/dictionaries.config';
import { TDictionaryKey } from '@/interfaces/dictionaries/tables';
import { useQuery } from '@tanstack/react-query';

const useDictionariesTableQuery = (dictionaryKey: TDictionaryKey, page: number = 1, search: string = '', enabled = true) => {
  const config = dictionariesConfig[dictionaryKey];

  return useQuery({
    queryKey: [config.queryKey, page, search],
    queryFn: () => config.fetchList({
      page,
      pageSize: config.pageSize,
      ...(search ? { search, } : {}),
    }),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
    enabled,
  });
}

export default useDictionariesTableQuery;
