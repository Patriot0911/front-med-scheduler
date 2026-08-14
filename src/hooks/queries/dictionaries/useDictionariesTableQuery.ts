import { dictionariesConfig } from '@/configs/dictionaries.config';
import { TDictionaryKey } from '@/interfaces/dictionaries/tables';
import { useQuery } from '@tanstack/react-query';

const useDictionariesTableQuery = (dictionaryKey: TDictionaryKey, page: number = 1) => {
  return useQuery({
    queryKey: [dictionariesConfig[dictionaryKey].queryKey, page],
    queryFn: () => dictionariesConfig[dictionaryKey].queryFn(page),
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });
}

export default useDictionariesTableQuery;
