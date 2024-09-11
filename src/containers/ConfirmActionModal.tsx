import Button from '@/components/inputs/Button';
import Modal from '@/components/cards/Modal';
import { MouseEventHandler } from 'react';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: MouseEventHandler<HTMLAnchorElement>;
  onConfirm: MouseEventHandler<HTMLAnchorElement>;
  message: string;
  heading?: string;
  className?: string;
  actionType?: 'delete' | 'update' | 'create';
}

const ConfirmActionModal = ({
  isOpen,
  onClose,
  onConfirm,
  heading,
  className,
  message,
  actionType,
}: ConfirmActionModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose as () => void}
      className={`min-w-[40vw] ${className}`}
      heading={heading || 'Confirm Action'}
      headingClassName={`${actionType === 'delete' && 'text-red-600'}`}
    >
      <article className="w-full flex flex-col gap-3">{message}</article>
      <menu className="w-full flex items-center gap-3 justify-between">
        <Button onClick={onClose}>Close</Button>
        <Button onClick={onConfirm} primary danger={actionType === 'delete'}>
          Confirm
        </Button>
      </menu>
    </Modal>
  );
};

export default ConfirmActionModal;
