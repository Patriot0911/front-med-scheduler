import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AuthService from '@/lib/services/auth.service';
import { getErrorMessage } from '@/lib/errors';
import { IChangePasswordPayload } from '@/interfaces/auth/profile';

const useChangePasswordMutation = (onSuccess?: () => void) => {
  return useMutation<boolean, Error, IChangePasswordPayload>({
    mutationFn: AuthService.changePassword,
    onSuccess: () => {
      toast.success('Password changed');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export default useChangePasswordMutation;
