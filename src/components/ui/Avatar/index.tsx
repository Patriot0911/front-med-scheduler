import { cn } from '@/lib/cn';

import styles from './styles.module.scss';

interface IAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

// "Іван Петренко" → "ІП", one word → its first letter
const getInitials = (name: string) => name
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((word) => word.charAt(0).toUpperCase())
  .join('');

const Avatar = ({ name, size = 'md', className, }: IAvatarProps) => {
  return (
    <span className={cn(styles.avatar, styles[size], className)} aria-hidden>
      {getInitials(name) || '?'}
    </span>
  );
}

export default Avatar;
