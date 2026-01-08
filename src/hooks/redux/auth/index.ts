import type { RootState } from '@/store';
import { createSelector } from "@reduxjs/toolkit";

export const useUserSelector = createSelector(
  (state: RootState) => state,
  (state) => state.auth.user,
);
export const useAuthSelector = createSelector(
  (state: RootState) => state,
  (state) => state.auth,
);
