import { ButtonVariant } from '@/interfaces/ui/buttons';
import { UseMutationResult } from '@tanstack/react-query';

export enum LoadingState {
  Loading = 'loading',
  Ide = 'ide',
  Pendding = 'pendding',
  Success = 'success',
};

export const LoadingStateVariantsMap: Record<LoadingState, ButtonVariant> = {
  [LoadingState.Ide]: 'primary',
  [LoadingState.Loading]: 'secondary',
  [LoadingState.Pendding]: 'secondary',
  [LoadingState.Success]: 'success',
};

export const mutationToLoadingState = (mutation: UseMutationResult<any, Error, any>): LoadingState => {
  if (mutation.isPending) return LoadingState.Pendding;
  if (mutation.isSuccess) return LoadingState.Success;
  return LoadingState.Ide;
};
