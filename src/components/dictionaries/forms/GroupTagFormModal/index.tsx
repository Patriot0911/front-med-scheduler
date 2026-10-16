'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupTagSchema, TGroupTagForm } from './group-tag.scheme';
import type { IGroupTag } from '@/interfaces/dictionaries/group-tags';
import type { IDictionaryFormModalProps } from '@/interfaces/dictionaries/tables';
import GroupTagsService, { GroupTagsQueryKey } from '@/lib/services/group-tags.service';
import { DictionaryQueryKey } from '@/lib/services/dictionaries.service';
import useDictionaryMutation from '@/hooks/mutations/dictionaries/useDictionaryMutation';
import DictionaryModal from '@/components/modals/DictionaryModal';
import FormInput from '@/components/ui/FormInput';

const GroupTagFormModal = ({ isOpen, item, onClose }: IDictionaryFormModalProps<IGroupTag>) => {
  const methods = useForm<TGroupTagForm>({
    resolver: zodResolver(groupTagSchema),
    mode: 'onTouched',
    defaultValues: { name: item?.name ?? '', },
  });

  const mutation = useDictionaryMutation({
    mutationFn: (data: TGroupTagForm) => item
      ? GroupTagsService.editGroupTag(item.id, data)
      : GroupTagsService.createGroupTag(data),
    invalidateKeys: [GroupTagsQueryKey.GroupTagsList, DictionaryQueryKey.GroupTags],
    successMessage: item ? 'Tag updated' : 'Tag created',
    onSuccess: onClose,
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({ name: item?.name ?? '', });
      mutation.reset();
    }
  }, [isOpen, item]);

  return (
    <DictionaryModal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit group tag' : 'New group tag'}
      description={'Tags label student groups, e.g. form of study or speciality.'}
      methods={methods}
      onSubmit={(data: TGroupTagForm) => mutation.mutate(data)}
      isPending={mutation.isPending}
      isEdit={!!item}
    >
      <FormInput<TGroupTagForm>
        name={'name'}
        label={'Name'}
        placeholder={'e.g. очне / педіатрія'}
        required
      />
    </DictionaryModal>
  );
}

export default GroupTagFormModal;
