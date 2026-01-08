import { IAuthUserPayload } from './user';

export interface IAuthStoreState {
  user: null | IAuthUserPayload;
  error: string | null;
  status: 'guest' | 'loading' | 'processing' | 'authenticated';
};
