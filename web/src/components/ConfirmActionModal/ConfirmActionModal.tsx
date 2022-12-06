import { Modal } from '../Modal/Modal';
import './ConfirmActionModal.scss';

interface ConfirmActionsModalProps {
  title: string;
  onClose?: () => void;
  id?: string;
  confirmationFunction: any;
}

export function ConfirmActionModal({
  title,
  onClose = () => { },
  id = 'confirmActionModal',
  confirmationFunction,
}: ConfirmActionsModalProps) {
  return (
    <>
      <Modal
        id={id}
        onClose={onClose}
      >
        <h2>{title}</h2>
        <div className='confirmActionModal'>
          <button
            className='confirmActionModal__button confirm'
            onClick={confirmationFunction}
          >
            Confirm
          </button>
          <button
            className='confirmActionModal__button cancel'
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}