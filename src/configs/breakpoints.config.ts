export const BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

export const mediaUp = (key: keyof typeof BREAKPOINTS) => `(min-width: ${BREAKPOINTS[key]}px)`;
