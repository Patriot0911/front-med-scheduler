'use client';

import useGroupTagsDictionaryQuery from '@/hooks/queries/dictionaries/useGroupTagsDictionaryQuery';
import ChipsCell from '../ChipsCell';

/** Group tag ids → tag names (from the cached /dictionaries/group-tags list). */
const GroupTagsCell = ({ tagIds }: { tagIds: string[] }) => {
  const { data: tags, } = useGroupTagsDictionaryQuery();
  const namesById = new Map((tags ?? []).map((tag) => [tag.id, tag.name]));

  return <ChipsCell items={tagIds.map((id) => namesById.get(id) ?? '…')} limit={3} />;
}

export default GroupTagsCell;
