import dayjs from '@/lib/dayjs';
import { LuBuilding2, LuCalendarRange, LuGraduationCap, LuShieldCheck, LuTags, LuUsers } from 'react-icons/lu';
import type { IDictionaryConfig, IDictionaryRow } from '@/interfaces/dictionaries/tables';
import type { IRole } from '@/interfaces/dictionaries/roles';
import type { IStudentGroup } from '@/interfaces/dictionaries/student-groups';
import type { IGroupTag } from '@/interfaces/dictionaries/group-tags';
import type { ISemester } from '@/interfaces/dictionaries/semesters';
import type { IDepartment } from '@/interfaces/dictionaries/departments';
import { Permission } from '@/interfaces/auth/permission';
import RolesService, { RolesQueryKey } from '@/lib/services/roles.service';
import StudentGroupsService, { StudentGroupsQueryKey } from '@/lib/services/student-groups.service';
import GroupTagsService, { GroupTagsQueryKey } from '@/lib/services/group-tags.service';
import SemestersService, { SemestersQueryKey } from '@/lib/services/semesters.service';
import DepartmentsService, { DepartmentsQueryKey } from '@/lib/services/departments.service';
import { DictionaryQueryKey } from '@/lib/services/dictionaries.service';
import { getPermissionLabel } from './permissions.config';
import ChipsCell from '@/components/dictionaries/cells/ChipsCell';
import GroupTagsCell from '@/components/dictionaries/cells/GroupTagsCell';
import TeacherNameCell from '@/components/dictionaries/cells/TeacherNameCell';
import RoleFormModal from '@/components/dictionaries/forms/RoleFormModal';
import StudentGroupFormModal from '@/components/dictionaries/forms/StudentGroupFormModal';
import GroupTagFormModal from '@/components/dictionaries/forms/GroupTagFormModal';
import SemesterFormModal from '@/components/dictionaries/forms/SemesterFormModal';
import DepartmentFormModal from '@/components/dictionaries/forms/DepartmentFormModal';
import DepartmentTeachersModal from '@/components/dictionaries/forms/DepartmentTeachersModal';

const PAGE_SIZE = 10;
const DATE_FORMAT = 'DD.MM.YYYY';

/** Erases the row type so configs of different dictionaries fit into one map. */
const defineDictionary = <T extends IDictionaryRow>(config: IDictionaryConfig<T>) =>
  config as unknown as IDictionaryConfig<IDictionaryRow>;

const departmentsDictionaryConfig = defineDictionary<IDepartment>({
  icon: <LuBuilding2 />,
  queryKey: DepartmentsQueryKey.DepartmentsList,
  pageSize: PAGE_SIZE,
  readPermissions: [Permission.READ_DEPARTMENTS, Permission.MANAGE_DEPARTMENTS, Permission.ADMIN],
  managePermissions: [Permission.MANAGE_DEPARTMENTS, Permission.ADMIN],
  fetchList: DepartmentsService.getDepartments,
  remove: DepartmentsService.deleteDepartment,
  getItemLabel: (department) => department.name,
  relatedQueryKeys: [DictionaryQueryKey.Departments, DictionaryQueryKey.Teachers],
  FormModal: DepartmentFormModal,
  rowActions: [
    {
      key: 'teachers',
      icon: <LuGraduationCap />,
      label: 'departments.teachersAction',
      Modal: DepartmentTeachersModal,
    },
  ],
  columns: [
    {
      key: 'name',
      title: 'columns.name',
      dataBind: 'name',
    },
    {
      key: 'head',
      title: 'departments.columns.head',
      width: '30%',
      render: (department) => <TeacherNameCell teacherId={department.headTeacherId} />,
    },
  ],
});

const studentGroupsDictionaryConfig = defineDictionary<IStudentGroup>({
  icon: <LuUsers />,
  queryKey: StudentGroupsQueryKey.StudentGroupsList,
  pageSize: PAGE_SIZE,
  readPermissions: [Permission.READ_GROUPS, Permission.ADMIN],
  managePermissions: [Permission.MANAGE_GROUPS, Permission.ADMIN],
  fetchList: StudentGroupsService.getStudentGroups,
  remove: StudentGroupsService.deleteStudentGroup,
  getItemLabel: (group) => group.name,
  FormModal: StudentGroupFormModal,
  columns: [
    {
      key: 'name',
      title: 'columns.name',
      dataBind: 'name',
      width: '25%',
    },
    {
      key: 'studyYear',
      title: 'studentGroups.columns.studyYear',
      dataBind: 'studyYear',
      width: '25%',
    },
    {
      key: 'tags',
      title: 'studentGroups.columns.tags',
      render: (group) => <GroupTagsCell tagIds={group.groupTags} />,
    },
  ],
});

const groupTagsDictionaryConfig = defineDictionary<IGroupTag>({
  icon: <LuTags />,
  queryKey: GroupTagsQueryKey.GroupTagsList,
  pageSize: PAGE_SIZE,
  readPermissions: [Permission.READ_GROUPS, Permission.ADMIN],
  managePermissions: [Permission.MANAGE_GROUPS, Permission.ADMIN],
  fetchList: GroupTagsService.getGroupTags,
  remove: GroupTagsService.deleteGroupTag,
  relatedQueryKeys: [DictionaryQueryKey.GroupTags, StudentGroupsQueryKey.StudentGroupsList],
  getItemLabel: (tag) => tag.name,
  FormModal: GroupTagFormModal,
  columns: [
    {
      key: 'name',
      title: 'columns.name',
      dataBind: 'name',
    },
  ],
});

const semestersDictionaryConfig = defineDictionary<ISemester>({
  icon: <LuCalendarRange />,
  queryKey: SemestersQueryKey.SemestersList,
  pageSize: PAGE_SIZE,
  readPermissions: [Permission.ADMIN],
  managePermissions: [Permission.ADMIN],
  fetchList: SemestersService.getSemesters,
  remove: SemestersService.deleteSemester,
  getItemLabel: (semester) => semester.name,
  FormModal: SemesterFormModal,
  relatedQueryKeys: [DictionaryQueryKey.Semesters],
  columns: [
    {
      key: 'name',
      title: 'columns.name',
      dataBind: 'name',
    },
    {
      key: 'dateFrom',
      title: 'semesters.columns.dateFrom',
      width: '18%',
      render: (semester) => dayjs(semester.dateFrom).format(DATE_FORMAT),
    },
    {
      key: 'dateTo',
      title: 'semesters.columns.dateTo',
      width: '18%',
      render: (semester) => dayjs(semester.dateTo).format(DATE_FORMAT),
    },
  ],
});

const rolesDictionaryConfig = defineDictionary<IRole>({
  icon: <LuShieldCheck />,
  queryKey: RolesQueryKey.RolesList,
  pageSize: PAGE_SIZE,
  readPermissions: [Permission.MANAGE_ROLES, Permission.ADMIN],
  managePermissions: [Permission.MANAGE_ROLES, Permission.ADMIN],
  fetchList: RolesService.getRoles,
  remove: RolesService.deleteRole,
  getItemLabel: (role) => role.name,
  FormModal: RoleFormModal,
  rowLock: {
    isLocked: (role) => !role.canManage,
    reason: 'roles.locked',
  },
  columns: [
    {
      key: 'name',
      title: 'columns.name',
      dataBind: 'name',
      width: '22%',
    },
    {
      key: 'rolePriority',
      title: 'roles.columns.priority',
      dataBind: 'rolePriority',
      width: '10%',
      align: 'center',
    },
    {
      key: 'permissions',
      title: 'roles.columns.permissions',
      render: (role) => <ChipsCell items={role.permissions.map(getPermissionLabel)} />,
    },
  ],
});

/** Tab order on the dictionaries page. */
export const dictionariesConfig = {
  departments: departmentsDictionaryConfig,
  studentGroups: studentGroupsDictionaryConfig,
  groupTags: groupTagsDictionaryConfig,
  semesters: semestersDictionaryConfig,
  roles: rolesDictionaryConfig,
};
