/**
 * The API rejects with `{ status: false, message }`, where `message` may be a list
 * (class-validator errors). Falls back to the given text for anything else.
 */
export const getErrorMessage = (error: unknown, fallback = 'Something went wrong'): string => {
  const message = (error as { message?: unknown } | null)?.message;
  if (Array.isArray(message)) {
    return message.join(', ');
  }
  if (typeof message === 'string' && message) {
    return message;
  }
  return fallback;
};
