import { createContext, useContext } from 'react';
import type { TModalLayout } from '@/interfaces/shared/modal';

export const ModalLayoutContext = createContext<TModalLayout>('dialog');

export const useModalLayout = () => useContext(ModalLayoutContext);
