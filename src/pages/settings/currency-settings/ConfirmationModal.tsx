import Modal from "@/components/cards/Modal";
import Button from "@/components/inputs/Button";
import Loader from "@/components/inputs/Loader";
import { capitalizeCamelCase } from "@/helpers/strings.helper";

interface Props {
  action: 'disable' | 'enable';
  onClose: () => void;
  isOpen: boolean;
  isLoading: boolean;
  handleConfirmation: () => void;
}

const ConfirmationModal = ({action, onClose, isOpen, isLoading, handleConfirmation}: Props) => {

    return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      heading={`${action} foreign currency`}
      className="min-w-[35vw] z-[10000]"
    >
      <p className="text-sm">
        Are you sure you want to {action} this foreign currency for this business registration?
      </p>
      {action === 'disable' && 
        <p className="text-sm mt-2">When foreign is disabled the user will not be able to register business with foreign currency</p>
      }
      {action === 'enable' &&
        <p className="text-sm mt-2">When foreign currency is enabled the user will be able to register business with foreign currency.</p>
      }
      <menu className="w-full flex items-center gap-3 justify-between mt-4">
        <Button
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          Cancel
        </Button>
        <Button
          className={`${action === 'disable' ? '!bg-red-600 border-red-600 hover:!bg-red-700 hover:!border-red-700' : 'bg-primary'}`}
          primary
          onClick={(e) => {
            e.preventDefault();
            handleConfirmation()
          }}
        >
          {isLoading ? <Loader /> : capitalizeCamelCase(action)}
        </Button>
      </menu>
    </Modal>
    )
}

export default ConfirmationModal;