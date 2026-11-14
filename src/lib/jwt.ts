interface IJwtPayload {
  sub?: string;
  exp?: number;
};

/** Reads the payload without verifying the signature: only for client-side hints, never for access decisions */
export const decodeJwt = (token: string): IJwtPayload | null => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const isJwtExpired = (token: string) => {
  const exp = decodeJwt(token)?.exp;
  return !exp || exp * 1000 <= Date.now();
};
