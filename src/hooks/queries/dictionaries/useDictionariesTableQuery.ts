import { dictionariesConfig } from '@/configs/dictionaries.config';
import { TDictionaryKey } from '@/interfaces/dictionaries/tables';
import { useQuery } from '@tanstack/react-query';

const useDictionariesTableQuery = (dictionaryKey: TDictionaryKey) => {
  return useQuery({
    queryKey: dictionariesConfig[dictionaryKey].queryKey,
    queryFn: dictionariesConfig[dictionaryKey].queryFn,
  });
}

export default useDictionariesTableQuery;
