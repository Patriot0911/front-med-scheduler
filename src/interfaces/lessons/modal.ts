import { IModalBaseProps } from '../shared/modal';
import { ICalendarEvent } from '../ui/calendar';

export interface IEventDetailsModalProps extends IModalBaseProps {
  event: ICalendarEvent | null;
};
