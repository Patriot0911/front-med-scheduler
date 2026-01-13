import { dictionariesConfig } from '@/configs/dictionaries.config';

export type TDictionaryKey = keyof typeof dictionariesConfig;

export interface IDictionaryTableProps {
  selectedDictionaryKey: TDictionaryKey;
};