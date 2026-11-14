import type { ParseKeys } from 'i18next';
import { LoadingState } from '@/lib/loading-mappers';

export const ConfirmModalButtonDictionary: Record<LoadingState, ParseKeys<'common'>> = {
  [LoadingState.Ide]: 'confirm.button.ide',
  [LoadingState.Pendding]: 'confirm.button.pendding',
  [LoadingState.Loading]: 'confirm.button.loading',
  [LoadingState.Success]: 'confirm.button.success',
};
