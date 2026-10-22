'use client';

import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LuCopy, LuEye, LuEyeOff, LuRefreshCw } from 'react-icons/lu';
import { generatePassword } from '@/lib/password';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { TUserForm } from '../user.scheme';

import styles from './styles.module.scss';

/** Optional initial password of a new user, with a generator and a copy button. */
const InitialPasswordField = () => {
  const { control, setValue, } = useFormContext<TUserForm>();
  const password = useWatch({ control, name: 'password', });
  const [isVisible, setIsVisible] = useState(false);

  const generate = () => {
    setValue('password', generatePassword(), { shouldDirty: true, shouldTouch: true, shouldValidate: true, });
    // a generated password is meant to be read and passed on
    setIsVisible(true);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success('Password copied');
    } catch {
      toast.error('Could not copy the password');
    }
  };

  return (
    <div className={styles.field}>
      <FormInput<TUserForm>
        name={'password'}
        label={'Initial password'}
        type={isVisible ? 'text' : 'password'}
        placeholder={'Leave empty to generate a random one'}
        autoComplete={'new-password'}
        icon={isVisible ? <LuEyeOff /> : <LuEye />}
        onIconClick={() => setIsVisible((prev) => !prev)}
      />
      <div className={styles.actions}>
        <Button
          variant={'ghost'}
          leftIcon={<LuRefreshCw />}
          className={styles.action}
          onClick={generate}
        >
          Generate
        </Button>
        <Button
          variant={'ghost'}
          leftIcon={<LuCopy />}
          className={styles.action}
          disabled={!password}
          onClick={copy}
        >
          Copy
        </Button>
      </div>
    </div>
  );
}

export default InitialPasswordField;
