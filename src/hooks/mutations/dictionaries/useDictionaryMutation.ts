import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getErrorMessage } from '@/lib/errors';

interface IUseDictionaryMutationOptions<TVariables> {
  mutationFn: (variables: TVariables) => Promise<unknown>;
  /** Query keys to refetch on success: the table list and the `/dictionaries/*` labels built from it. */
  invalidateKeys: string[];
  successMessage: string;
  onSuccess?: () => void;
};

/** Create / edit / delete in a dictionary: refetches dependent queries and reports the result with a toast. */
const useDictionaryMutation = <TVariables,>({
  mutationFn,
  invalidateKeys,
  successMessage,
  onSuccess,
}: IUseDictionaryMutationOptions<TVariables>) => {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, TVariables>({
    mutationFn,
    onSuccess: async () => {
      await Promise.all(
        invalidateKeys.map((key) => queryClient.invalidateQueries({ queryKey: [key], }))
      );
      toast.success(successMessage);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export default useDictionaryMutation;
