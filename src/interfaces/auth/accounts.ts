/** `signed_out`: the session ended (expired, revoked or rejected); the account stays listed to sign in again */
export type TAccountStatus = 'signed_in' | 'signed_out';

export interface IStoredAccount {
  id: string;
  email: string;
  fullName: string;
  status: TAccountStatus;
  accessToken: string | null;
  refreshToken: string | null;
  lastUsedAt: number;
};

export interface IAccountsListProps {
  /** A signed-in account to switch to, or a signed-out one to sign in again */
  onSelect: (account: IStoredAccount) => void;
  disabled?: boolean;
};
