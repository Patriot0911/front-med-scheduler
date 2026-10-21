import { PropsWithChildren } from 'react';

export interface ICollapseProps extends PropsWithChildren {
  isOpen: boolean;
  /** Applied to the inner content wrapper, so paddings / gaps animate together with the height */
  className?: string;
};
