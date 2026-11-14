import { useMutation, useQueryClient, } from '@tanstack/react-query';
import { useAppDispatch } from '../../redux';
import AuthService from '@/lib/services/auth.service';
import AuthAccounts from '@/lib/auth-accounts';
import { logout } from '@/store/slices/authSlice';

const useLogoutAllMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await Promise.allSettled(AuthAccounts.getAccounts()
        .filter((account) => account.refreshToken)
        .map((account) => AuthService.logout(account.refreshToken!)));
      AuthAccounts.clear();
      dispatch(logout());
      queryClient.clear();
    },
  });
};

export default useLogoutAllMutation;
