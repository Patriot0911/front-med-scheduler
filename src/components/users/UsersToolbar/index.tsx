'use client';

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

const PROFILE_OPTIONS: ISelectOption[] = [
  { value: UserProfileType.Teacher, label: 'Teacher', },
  { value: UserProfileType.Student, label: 'Student', },
  { value: UserProfileType.None, label: 'No profile', },
];

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
            placeholder={'Search by name or email…'}
            aria-label={'Search by name or email'}
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
            placeholder={'All roles'}
            searchPlaceholder={'Search role…'}
            searchable
            hideErrorMessage
          />
        )}
        <MultiSelect
          className={styles.filter}
          options={PROFILE_OPTIONS}
          value={draft.profiles}
          onChange={(profiles) => setDraft((prev) => ({ ...prev, profiles: profiles as UserProfileType[], }))}
          placeholder={'All profiles'}
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
            Apply filters
          </Button>
        </div>
      </div>
      {canManage && (
        <Button
          leftIcon={<LuPlus />}
          onClick={onCreate}
          className={styles['action-button']}
        >
          Add user
        </Button>
      )}
    </div>
  );
}

export default UsersToolbar;
