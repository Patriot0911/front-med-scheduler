import { useMutation, useQueryClient, } from '@tanstack/react-query';
import { useAppDispatch } from '../redux';
import AuthService, { AuthQueryKey } from '@/lib/services/auth.service';
import { login, logout } from '@/store/slices/authSlice';
import { IAuthUserResponse } from '@/interfaces/auth/user';
import { ILoginRequestPayload, ILoginResponse } from '@/interfaces/auth/login';

const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<ILoginResponse, Error, ILoginRequestPayload>({
    mutationFn: AuthService.login,
    onSuccess: ({ data }) => {
      dispatch(login(data.tokens));
      queryClient.setQueryData([AuthQueryKey.Me], {
        data: data.user,
        status: true,
      } satisfies IAuthUserResponse);
    },
    onError: () => {
      dispatch(logout());
    },
  });
};

export default useLoginMutation;
