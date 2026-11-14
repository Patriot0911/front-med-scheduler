import type { ParseKeys } from 'i18next';
import { LoadingState } from '@/lib/loading-mappers';

export const AuthLoginButtonDictionary: Record<LoadingState, ParseKeys<'auth'>> = {
  [LoadingState.Ide]: 'signIn.button.ide',
  [LoadingState.Pendding]: 'signIn.button.pendding',
  [LoadingState.Loading]: 'signIn.button.loading',
  [LoadingState.Success]: 'signIn.button.success',
};

export const AuthAddAccountButtonDictionary: Record<LoadingState, ParseKeys<'auth'>> = {
  [LoadingState.Ide]: 'addAccount.button.ide',
  [LoadingState.Pendding]: 'addAccount.button.pendding',
  [LoadingState.Loading]: 'addAccount.button.loading',
  [LoadingState.Success]: 'addAccount.button.success',
};
