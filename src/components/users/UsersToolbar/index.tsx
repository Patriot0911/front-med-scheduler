'use client';

import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { LuFilter, LuPlus, LuSearch, LuX } from 'react-icons/lu';
import { ISelectOption } from '@/interfaces/ui/selectors';
import { cn } from '@/lib/cn';
import { IUsersFilters, IUsersToolbarProps, UserProfileType } from '@/interfaces/users/users';
import useRolesDictionaryQuery from '@/hooks/queries/dictionaries/useRolesDictionaryQuery';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import MultiSelect from '@/components/ui/MultiSelect';

import styles from './styles.module.scss';

const PROFILE_TYPES = [UserProfileType.Teacher, UserProfileType.Student, UserProfileType.None];

const EMPTY_FILTERS: IUsersFilters = { roleIds: [], profiles: [], };

// selection order does not matter
const isSameSelection = (a: string[], b: string[]) =>
  a.length === b.length && a.every((value) => b.includes(value));

const isSameFilters = (a: IUsersFilters, b: IUsersFilters) =>
  isSameSelection(a.roleIds, b.roleIds) && isSameSelection(a.profiles, b.profiles);

const hasAnyFilter = ({ roleIds, profiles, }: IUsersFilters) => roleIds.length > 0 || profiles.length > 0;

const UsersToolbar = ({
  search,
  onSearchChange,
  filters,
  onFiltersApply,
  canFilterByRoles,
  canManage,
  onCreate,
}: IUsersToolbarProps) => {
  const { t, } = useTranslation('users');
  const profileOptions: ISelectOption[] = PROFILE_TYPES.map((type) => ({ value: type, label: t(`profiles.${type}`), }));
  const { data: roles, } = useRolesDictionaryQuery(canFilterByRoles);
  const roleOptions: ISelectOption[] = (roles ?? []).map((role) => ({ value: role.id, label: role.name, }));
  const [draft, setDraft] = useState<IUsersFilters>(filters);

  const clear = () => {
    setDraft(EMPTY_FILTERS);
    if (hasAnyFilter(filters)) onFiltersApply(EMPTY_FILTERS);
  };

  return (
    <div className={cn(styles.toolbar, 'fields-compact')}>
      <div className={styles.filters}>
        <div className={styles.search}>
          <Input
            name={'users-search'}
            value={search}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchLabel')}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={search ? <LuX /> : <LuSearch />}
            onIconClick={() => onSearchChange('')}
            hideErrorMessage
          />
        </div>
        {canFilterByRoles && (
          <MultiSelect
            className={styles.filter}
            options={roleOptions}
            value={draft.roleIds}
            onChange={(roleIds) => setDraft((prev) => ({ ...prev, roleIds, }))}
            placeholder={t('allRoles')}
            searchPlaceholder={t('searchRole')}
            searchable
            hideErrorMessage
          />
        )}
        <MultiSelect
          className={styles.filter}
          options={profileOptions}
          value={draft.profiles}
          onChange={(profiles) => setDraft((prev) => ({ ...prev, profiles: profiles as UserProfileType[], }))}
          placeholder={t('allProfiles')}
          hideErrorMessage
        />
        <div className={styles['filter-actions']}>
          <Button
            variant={'primary'}
            leftIcon={<LuFilter />}
            disabled={isSameFilters(draft, filters)}
            onClick={() => onFiltersApply(draft)}
            className={styles['action-button']}
          >
            {t('applyFilters')}
          </Button>
        </div>
      </div>
      {canManage && (
        <Button
          leftIcon={<LuPlus />}
          onClick={onCreate}
          className={styles['action-button']}
        >
          {t('add')}
        </Button>
      )}
    </div>
  );
}

export default UsersToolbar;
