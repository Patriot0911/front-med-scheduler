import { useMutation, useQueryClient, } from '@tanstack/react-query';
import { useAppDispatch } from '../../redux';
import AuthService, { AuthQueryKey } from '@/lib/services/auth.service';
import AuthAccounts from '@/lib/auth-accounts';
import { login } from '@/store/slices/authSlice';
import { IAuthUser } from '@/interfaces/auth/user';
import { ILoginRequestPayload, ILoginResponse } from '@/interfaces/auth/login';

/** `addAccount`: only saves the account, the caller switches to it (with a reload) */
const useLoginMutation = (addAccount = false) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<ILoginResponse, Error, ILoginRequestPayload>({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      AuthAccounts.signIn(data.user, data.tokens, !addAccount);
      if (addAccount) return;
      dispatch(login());
      queryClient.setQueryData(
        [AuthQueryKey.Me],
        data.user satisfies IAuthUser
      );
    },
  });
};

export default useLoginMutation;
