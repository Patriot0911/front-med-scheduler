export interface IModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
};
export interface IModalProps extends IModalBaseProps {
  children: React.ReactNode;
  className?: string;
};
