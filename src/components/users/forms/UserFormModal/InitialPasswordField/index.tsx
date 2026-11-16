'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { LuCopy, LuRefreshCw } from 'react-icons/lu';
import { generatePassword } from '@/lib/password';
import FormPasswordInput from '@/components/ui/FormPasswordInput';
import Button from '@/components/ui/Button';
import { TUserForm } from '../user.scheme';

import styles from './styles.module.scss';

/** Optional initial password of a new user, with a generator and a copy button. */
const InitialPasswordField = () => {
  const { t, } = useTranslation('users');
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
      toast.success(t('password.copied'));
    } catch {
      toast.error(t('password.copyFailed'));
    }
  };

  return (
    <div className={styles.field}>
      <FormPasswordInput<TUserForm>
        name={'password'}
        label={t('password.label')}
        placeholder={t('password.placeholder')}
        autoComplete={'new-password'}
        // controlled: "Generate" reveals the password
        isRevealed={isVisible}
        onRevealChange={setIsVisible}
      />
      <div className={styles.actions}>
        <Button
          variant={'ghost'}
          leftIcon={<LuRefreshCw />}
          className={styles.action}
          onClick={generate}
        >
          {t('password.generate')}
        </Button>
        <Button
          variant={'ghost'}
          leftIcon={<LuCopy />}
          className={styles.action}
          disabled={!password}
          onClick={copy}
        >
          {t('password.copy')}
        </Button>
      </div>
    </div>
  );
}

export default InitialPasswordField;
