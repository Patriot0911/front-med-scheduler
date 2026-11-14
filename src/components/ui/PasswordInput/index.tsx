'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import { IPasswordInputProps } from '@/interfaces/ui/inputs';
import Input from '@/components/ui/Input';

/** Password field with an optional show / hide toggle. */
const PasswordInput = ({
  canReveal = true,
  isRevealed: controlledIsRevealed,
  onRevealChange,
  ...props
}: IPasswordInputProps) => {
  const { t, } = useTranslation('ui');
  const [uncontrolledIsRevealed, setUncontrolledIsRevealed] = useState(false);
  const isRevealed = canReveal && (controlledIsRevealed ?? uncontrolledIsRevealed);

  const toggle = () => {
    const next = !isRevealed;
    setUncontrolledIsRevealed(next);
    onRevealChange?.(next);
  };

  return (
    <Input
      {...props}
      type={isRevealed ? 'text' : 'password'}
      icon={canReveal ? (isRevealed ? <LuEyeOff /> : <LuEye />) : undefined}
      onIconClick={canReveal ? toggle : undefined}
      iconLabel={isRevealed ? t('password.hide') : t('password.show')}
    />
  );
};

export default PasswordInput;
