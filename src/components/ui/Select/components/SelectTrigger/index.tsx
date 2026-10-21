import { cn } from '@/lib/cn';
import { useSelectContext } from '../../context';
import { LuChevronDown } from 'react-icons/lu';

import styles from './styles.module.scss';

interface ISelectTriggerProps {
  className?: string;
  disabled?: boolean;
}

const SelectTrigger = ({ className, disabled }: ISelectTriggerProps) => {
  const { isOpen, toggle } = useSelectContext();

  return (
    <>
      {/* the whole field is clickable, while the chevron takes its place in the row like an Input icon */}
      <button
        type="button"
        onClick={() => !disabled && toggle()}
        className={cn(
          styles.trigger,
          className,
          disabled && styles['disabled']
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      />
      <span className={styles['trigger-icon']}>
        <LuChevronDown
          size={16}
          className={cn(isOpen && styles['trigger-icon__open'])}
        />
      </span>
    </>
  );
};

export default SelectTrigger;
