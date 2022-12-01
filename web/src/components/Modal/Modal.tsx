import { XCircle } from 'phosphor-react';
import { ReactNode } from 'react';
import './Modal.scss';

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  id?: string;
}

export function Modal({ id = 'modal', children, onClose = () => { } }: ModalProps) {
  const handleOutsideClick = (e: any) => {
    if (e.target.id == id) onClose();
  };

  return (
    <div id={id} className='modal' onClick={handleOutsideClick}>
      <div className="modal__container">
        <div className="modal__container__closeButton__div">
          <button onClick={onClose} className="modal__container__closeButton" >
            <XCircle size={40} />
          </button>
        </div>
        <div className="modal__container__content">
          {children}
        </div>
      </div>
    </div>
  );
}
