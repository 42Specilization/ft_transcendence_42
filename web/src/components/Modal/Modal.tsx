import './Modal.scss';

interface ModalProps {
  children: any;
  onClose?: () => void;
  id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function Modal({ id = 'modal' ,children, onClose = () => {} }:ModalProps) {
  const handleOutsideClick = (e: any)=> {
    if (e.target.id == id) onClose();
  };

  return (
    <div id={id} className='modal' onClick={handleOutsideClick}>
      <div className="modal__container">
        <button onClick={onClose} className="modal__container__closeButton"/>
        <div className="modal__container__content">
          {children}
        </div>
      </div>
    </div>
  );
}
