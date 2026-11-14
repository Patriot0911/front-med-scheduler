'use client';

import { useState } from 'react';
import { EMPTY_LESSONS_FILTERS, LESSONS_LIST_FILTERS } from '@/configs/lessons-views.config';
import { countActiveFilters, isSameFilters } from '@/lib/lessons-filters';
import useLessonsFilterOptions from '@/hooks/lessons/useLessonsFilterOptions';
import { LessonVisibility } from '@/interfaces/lessons/lesson';
import type { ILessonsFilters, TLessonsListFilterKey } from '@/interfaces/lessons/filters';
import type { ILessonsFiltersFormProps } from '@/interfaces/lessons/modal';
import type { ISelectOption } from '@/interfaces/ui/selectors';
import SideModal from '@/components/ui/SideModal';
import Button from '@/components/ui/Button';
import MultiSelect from '@/components/ui/MultiSelect';
import Select from '@/components/ui/Select';

import styles from './styles.module.scss';

const VISIBILITY_OPTIONS: ISelectOption[] = [
  { value: '', label: 'Any visibility', },
  { value: LessonVisibility.All, label: 'Public', },
  { value: LessonVisibility.Involved, label: 'Participants only', },
];

// mounted only while the modal is open, so every opening starts from the applied filters
const LessonsFiltersForm = ({ filterKeys, filters, onApply, onClose, }: ILessonsFiltersFormProps) => {
  const [draft, setDraft] = useState<ILessonsFilters>(filters);
  const options = useLessonsFilterOptions(filterKeys);
  const listKeys = filterKeys.filter((key): key is TLessonsListFilterKey => key !== 'visibility');
  const draftCount = countActiveFilters(draft, filterKeys);

  const apply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <SideModal.FormBody
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      <SideModal.Header
        title={'Filters'}
        description={'Show only the lessons that match all selected filters.'}
      />
      <SideModal.Content className={'fields-compact'}>
        <div className={styles.summary}>
          <span>{draftCount > 0 ? `Selected: ${draftCount}` : 'No filters selected'}</span>
          <Button
            variant={'ghost'}
            disabled={draftCount === 0}
            onClick={() => setDraft(EMPTY_LESSONS_FILTERS)}
          >
            Clear all
          </Button>
        </div>
        <div className={styles.fields}>
          {listKeys.map((key) => (
            <MultiSelect
              key={key}
              label={LESSONS_LIST_FILTERS[key].label}
              options={options[key]}
              value={draft[key]}
              onChange={(values) => setDraft((prev) => ({ ...prev, [key]: values, }))}
              placeholder={LESSONS_LIST_FILTERS[key].placeholder}
              searchPlaceholder={LESSONS_LIST_FILTERS[key].searchPlaceholder}
              searchable
              hideErrorMessage
            />
          ))}
          {filterKeys.includes('visibility') && (
            <Select
              label={'Visibility'}
              options={VISIBILITY_OPTIONS}
              value={draft.visibility}
              onChange={(visibility) => setDraft((prev) => ({ ...prev, visibility: visibility as LessonVisibility | '', }))}
              hideErrorMessage
            >
              <Select.Selected<ISelectOption>>
                {(option) => option.label}
              </Select.Selected>
              <Select.Area>
                <Select.Option<ISelectOption>>
                  {(option) => option.label}
                </Select.Option>
              </Select.Area>
            </Select>
          )}
        </div>
      </SideModal.Content>
      <SideModal.Footer>
        <Button className={'flex-1'} variant={'secondary'} onClick={onClose}>
          Cancel
        </Button>
        <Button
          type={'submit'}
          className={'flex-1'}
          variant={'primary'}
          disabled={isSameFilters(draft, filters, filterKeys)}
        >
          Apply filters
        </Button>
      </SideModal.Footer>
    </SideModal.FormBody>
  );
}

export default LessonsFiltersForm;
