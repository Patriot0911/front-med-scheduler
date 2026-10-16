/** Items of the lightweight `/dictionaries/*` endpoints (used for selects and labels). */
export interface IDictionaryItem {
  id: string;
  name: string;
};

export interface ITeacherDictionaryItem extends IDictionaryItem {
  departmentId: string | null;
};
