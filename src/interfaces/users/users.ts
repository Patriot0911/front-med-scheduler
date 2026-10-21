export enum UserProfileType {
  Teacher = 'teacher',
  Student = 'student',
  None = 'none',
};

export interface IUsersFilters {
  roleIds: string[];
  profiles: UserProfileType[];
};

export interface IUsersToolbarProps {
  search: string;
  onSearchChange: (search: string) => void;
  filters: IUsersFilters;
  onFiltersChange: (filters: IUsersFilters) => void;
  /** Roles filter needs the roles dictionary, which requires its own permission */
  canFilterByRoles: boolean;
  canManage: boolean;
  onCreate: () => void;
};
