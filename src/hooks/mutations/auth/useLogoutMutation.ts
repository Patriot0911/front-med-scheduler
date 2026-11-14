import { useMutation, useQueryClient, } from '@tanstack/react-query';
import { useAppDispatch } from '../../redux';
import AuthService from '@/lib/services/auth.service';
import AuthAccounts from '@/lib/auth-accounts';
import { logout } from '@/store/slices/authSlice';

/**
 * Logs out of the account (the active one by default) and removes it from the saved ones.
 * Leaving the active account switches to the most recent signed-in one, if any.
 */
const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<void, Error, string | void>({
    mutationFn: async (accountId) => {
      const account = accountId ? AuthAccounts.getAccount(accountId) : AuthAccounts.getActive();
      if (!account) return;
      // an already ended or unreachable server session must not keep the account on this device
      if (account.refreshToken) await AuthService.logout(account.refreshToken).catch(() => undefined);

      const wasActive = account.id === AuthAccounts.getActive()?.id;
      AuthAccounts.remove(account.id);
      if (!wasActive) return;

      const next = AuthAccounts.getNextUsable();
      if (next && AuthAccounts.switchTo(next.id)) return;
      dispatch(logout());
      queryClient.clear();
    },
  });
};

export default useLogoutMutation;
