import { cn } from '@/lib/cn';
import { useSelectContext } from '../../context';
import { ISelectOption } from '@/interfaces/ui/selectors';
import { IFormSelectedOptionProps } from './FormSelectedOption';

import styles from './styles.module.scss';

const FormSelectedOption = <O extends ISelectOption<string, string>>({
  children,
  className
}: IFormSelectedOptionProps<O>) => {
  const { selectedOption } = useSelectContext<O>();

  if (!selectedOption) return null;

  return (
    <span className={cn(styles['selected-item'], className)}>
      {children(selectedOption)}
    </span>
  );
}

export default FormSelectedOption;
