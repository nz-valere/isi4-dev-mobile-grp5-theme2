import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatWeekDate = (date: Date): string => {
  return format(date, "'Semaine du' dd MMMM yyyy", { locale: fr });
};

export const formatDayDate = (date: Date): string => {
  return format(date, "EEEE dd MMMM yyyy", { locale: fr });
};