import { useMutation, useQueryClient, } from '@tanstack/react-query';
import { useAppDispatch } from '../redux';
import AuthService, { AuthQueryKey } from '@/lib/services/auth.service';
import { login, logout } from '@/store/slices/authSlice';

const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: ({ data }) => {
      dispatch(login(data.tokens));
      queryClient.setQueriesData(
        { queryKey: [AuthQueryKey.Me], }, data.user
      );
    },
    onError: () => {
      dispatch(logout());
    },
  });
};

export default useLoginMutation;
