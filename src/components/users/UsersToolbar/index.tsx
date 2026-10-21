'use client';

import { LuPlus, LuSearch, LuX } from 'react-icons/lu';
import { ISelectOption } from '@/interfaces/ui/selectors';
import { IUsersToolbarProps, UserProfileType } from '@/interfaces/users/users';
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

const UsersToolbar = ({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  canFilterByRoles,
  canManage,
  onCreate,
}: IUsersToolbarProps) => {
  const { data: roles, } = useRolesDictionaryQuery(canFilterByRoles);
  const roleOptions: ISelectOption[] = (roles ?? []).map((role) => ({ value: role.id, label: role.name, }));

  return (
    <div className={styles.toolbar}>
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
            value={filters.roleIds}
            onChange={(roleIds) => onFiltersChange({ ...filters, roleIds, })}
            placeholder={'All roles'}
            searchPlaceholder={'Search role…'}
            searchable
            hideOptionalFlag
            hideErrorMessage
          />
        )}
        <MultiSelect
          className={styles.filter}
          options={PROFILE_OPTIONS}
          value={filters.profiles}
          onChange={(profiles) => onFiltersChange({ ...filters, profiles: profiles as UserProfileType[], })}
          placeholder={'All profiles'}
          hideOptionalFlag
          hideErrorMessage
        />
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
