import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AuthService from '@/lib/services/auth.service';
import { getErrorMessage } from '@/lib/errors';
import { IChangePasswordPayload } from '@/interfaces/auth/profile';

const useChangePasswordMutation = (onSuccess?: () => void) => {
  const { t, } = useTranslation('auth');

  return useMutation<boolean, Error, IChangePasswordPayload>({
    mutationFn: AuthService.changePassword,
    onSuccess: () => {
      toast.success(t('profile.password.changed'));
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

export default useChangePasswordMutation;
