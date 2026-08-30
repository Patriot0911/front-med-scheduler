import { cn } from '@/lib/cn';
import { IHeadingProps } from '@/interfaces/ui/headings';
import type { ElementType } from 'react';

import styles from './styles.module.scss';

const Heading = ({ children, level = 1, className, ...props }: IHeadingProps) => {
  const Tag: ElementType = `h${level}`;
  return (
    <Tag
      className={cn(className, styles.heading)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Heading;