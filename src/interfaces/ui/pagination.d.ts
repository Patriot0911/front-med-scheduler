export interface IPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  showInfo?: boolean;
  disabled?: boolean;
  className?: string;
};
