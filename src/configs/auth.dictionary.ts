import { LoadingState } from '@/lib/loading-mappers';

export const AuthLoginButtonDictionary: Record<LoadingState, string> = {
  [LoadingState.Ide]: 'Sign in',
  [LoadingState.Pendding]: 'Processing...',
  [LoadingState.Loading]: 'Loading...',
  [LoadingState.Success]: 'Signed in successfully!',
};

export const AuthAddAccountButtonDictionary: Record<LoadingState, string> = {
  [LoadingState.Ide]: 'Add account',
  [LoadingState.Pendding]: 'Processing...',
  [LoadingState.Loading]: 'Loading...',
  [LoadingState.Success]: 'Switching account...',
};
