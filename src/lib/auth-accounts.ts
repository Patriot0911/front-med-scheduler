import type { IStoredAccount } from '@/interfaces/auth/accounts';
import type { IAuthToken } from '@/interfaces/auth/token';
import type { IAuthUser } from '@/interfaces/auth/user';
import { decodeJwt, isJwtExpired } from './jwt';

const ACCOUNTS_KEY = 'auth_accounts';
const ACTIVE_ACCOUNT_KEY = 'auth_active_account';
const LEGACY_ACCESS_TOKEN_KEY = 'access_token';
const LEGACY_REFRESH_TOKEN_KEY = 'refresh_token';
const STORAGE_KEYS = [ACCOUNTS_KEY, ACTIVE_ACCOUNT_KEY];
const EMPTY_ACCOUNTS: IStoredAccount[] = [];

export const MAX_ACCOUNTS = 5;

/*
 * Saved accounts of this browser; one of them is active for every tab.
 * Storage keeps the list and only the id of the active account, so a token rotation is written in one place.
 * The list is parsed once into memory (and again on a `storage` event or before a refresh), and the active
 * account is a reference into it: reading the access token per request costs nothing.
 */
let accounts: IStoredAccount[] = EMPTY_ACCOUNTS;
let active: IStoredAccount | null = null;
const listeners = new Set<() => void>();

const readStorage = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else if (localStorage.getItem(key) !== value) localStorage.setItem(key, value);
  } catch {
    return;
  }
};

const parseAccounts = (raw: string | null): IStoredAccount[] => {
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const isUsable = (account: IStoredAccount) => (
  account.status === 'signed_in' && !!account.refreshToken && !isJwtExpired(account.refreshToken)
);

const setState = (next: IStoredAccount[], activeId: string | null) => {
  accounts = next;
  active = next.find((account) => account.id === activeId && account.status === 'signed_in') ?? null;
  listeners.forEach((listener) => listener());
};

const commit = (next: IStoredAccount[], activeId: string | null = active?.id ?? null) => {
  setState(next, activeId);
  writeStorage(ACCOUNTS_KEY, JSON.stringify(accounts));
  writeStorage(ACTIVE_ACCOUNT_KEY, active?.id ?? null);
};

const signOut = (account: IStoredAccount): IStoredAccount => ({
  ...account,
  status: 'signed_out',
  accessToken: null,
  refreshToken: null,
});

const update = (id: string, patch: (account: IStoredAccount) => IStoredAccount) => (
  accounts.map((account) => (account.id === id ? patch(account) : account))
);

// sessions of the single-account version: the profile is filled in by the first /auth/me
const migrateLegacySession = () => {
  const refreshToken = readStorage(LEGACY_REFRESH_TOKEN_KEY);
  const accessToken = readStorage(LEGACY_ACCESS_TOKEN_KEY);
  writeStorage(LEGACY_REFRESH_TOKEN_KEY, null);
  writeStorage(LEGACY_ACCESS_TOKEN_KEY, null);

  const id = refreshToken && decodeJwt(refreshToken)?.sub;
  if (!id || readStorage(ACCOUNTS_KEY)) return;
  writeStorage(ACCOUNTS_KEY, JSON.stringify([{
    id,
    email: '',
    fullName: '',
    status: 'signed_in',
    accessToken,
    refreshToken,
    lastUsedAt: Date.now(),
  } satisfies IStoredAccount]));
  writeStorage(ACTIVE_ACCOUNT_KEY, id);
};

const AuthAccounts = {
  isStorageKey: (key: string | null) => key === null || STORAGE_KEYS.includes(key),

  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getAccounts: () => accounts,
  getServerAccounts: () => EMPTY_ACCOUNTS,
  getActive: () => active,
  getAccessToken: () => active?.accessToken ?? null,
  getAccount: (id: string) => accounts.find((account) => account.id === id) ?? null,
  isUsable,

  /** Re-reads storage that another tab may have changed */
  sync: () => {
    setState(parseAccounts(readStorage(ACCOUNTS_KEY)), readStorage(ACTIVE_ACCOUNT_KEY));
  },

  /** Loads the accounts and signs out the ones whose refresh token has expired */
  init: () => {
    migrateLegacySession();
    AuthAccounts.sync();
    if (accounts.some((account) => account.status === 'signed_in' && !isUsable(account))) {
      commit(accounts.map((account) => (account.status === 'signed_in' && !isUsable(account) ? signOut(account) : account)));
    }
    return active;
  },

  /** Adds or refreshes the account; the least recently used other one makes room past MAX_ACCOUNTS */
  signIn: (user: IAuthUser, tokens: IAuthToken, activate: boolean) => {
    const account: IStoredAccount = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      status: 'signed_in',
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      lastUsedAt: Date.now(),
    };
    const exists = accounts.some((item) => item.id === user.id);
    let next = exists ? update(user.id, () => account) : [...accounts, account];

    if (next.length > MAX_ACCOUNTS) {
      const evicted = next
        .filter((item) => item.id !== user.id && item.id !== active?.id)
        .sort((a, b) => Number(a.status === 'signed_in') - Number(b.status === 'signed_in') || a.lastUsedAt - b.lastUsedAt)[0];
      next = next.filter((item) => item !== evicted);
    }
    commit(next, activate ? user.id : active?.id ?? null);
  },

  updateSession: (id: string, tokens: IAuthToken, user?: IAuthUser) => {
    commit(update(id, (account) => ({
      ...account,
      email: user?.email ?? account.email,
      fullName: user?.fullName ?? account.fullName,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      lastUsedAt: Date.now(),
    })));
  },

  updateProfile: (user: IAuthUser) => {
    const account = AuthAccounts.getAccount(user.id);
    if (!account || (account.email === user.email && account.fullName === user.fullName)) return;
    commit(update(user.id, (item) => ({ ...item, email: user.email, fullName: user.fullName, })));
  },

  signOut: (id: string) => {
    commit(update(id, signOut));
  },

  remove: (id: string) => {
    commit(accounts.filter((account) => account.id !== id));
  },

  clear: () => {
    commit([], null);
  },

  /** The most recently used signed-in account other than `excludeId` */
  getNextUsable: (excludeId?: string) => (
    accounts
      .filter((account) => account.id !== excludeId && isUsable(account))
      .sort((a, b) => b.lastUsedAt - a.lastUsedAt)[0] ?? null
  ),

  /**
   * Makes the account active and reloads into the dashboard, which drops the query cache, requests in flight
   * and the previous user's page (it may be closed to the new one). Other tabs follow via the `storage` event.
   * Returns false, after marking it signed out, when its session has already expired.
   */
  switchTo: (id: string) => {
    const account = AuthAccounts.getAccount(id);
    if (!account) return false;
    if (!isUsable(account)) {
      AuthAccounts.signOut(id);
      return false;
    }
    commit(update(id, (item) => ({ ...item, lastUsedAt: Date.now(), })), id);
    window.location.assign('/dashboard');
    return true;
  },
};

export default AuthAccounts;
