import type { ILogInModalProps } from '@/interfaces/auth/modal';
import { useForm } from 'react-hook-form';
import { login } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import Modal from '@/components/ui/Modal';
import { useUserSelector } from '@/hooks/redux/auth';
import FormInput from '@/components/ui/FormInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, TLoginForm } from './login.scheme';

const LogInModal = (props: ILogInModalProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useUserSelector);
  const { register, handleSubmit, formState: { errors, }, } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const loginHandler = (data: TLoginForm) => {
    console.log({ data, });
    // dispatch(login({ email: 'us2fwwffer@example.com' , password: 'password123', }));
  };

  return (
    <Modal {...props}>
      <form onSubmit={handleSubmit(loginHandler)}>
        <FormInput
          register={register}
          bindName={'email'}
          label='Email'
          error={errors.email?.message}
        />
        <FormInput
          register={register}
          bindName={'password'}
          label='Password'
          error={errors.password?.message}
        />
        <button type="submit">Log In</button>
      </form>
    </Modal>
  );
}

export default LogInModal;
