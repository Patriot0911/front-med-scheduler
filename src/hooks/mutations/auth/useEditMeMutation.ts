import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AuthService, { AuthQueryKey } from '@/lib/services/auth.service';
import { UsersQueryKey } from '@/lib/services/users.service';
import { DictionaryQueryKey } from '@/lib/services/dictionaries.service';
import { getErrorMessage } from '@/lib/errors';
import { IAuthMeResponse } from '@/interfaces/auth/me';
import { IEditMePayload } from '@/interfaces/auth/profile';

const useEditMeMutation = (onSuccess?: (data: IAuthMeResponse) => void) => {
  const queryClient = useQueryClient();

  return useMutation<IAuthMeResponse, Error, IEditMePayload>({
    mutationFn: AuthService.editMe,
    onSuccess: async (data) => {
      queryClient.setQueryData([AuthQueryKey.Me], data);
      // the name is also shown in the users table and the teachers lists
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [UsersQueryKey.UsersList], }),
        queryClient.invalidateQueries({ queryKey: [DictionaryQueryKey.Teachers], }),
      ]);
      toast.success('Profile updated');
      onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export default useEditMeMutation;
