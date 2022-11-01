import './TFAModal.scss'
interface ModalProps {
  children: any;
  onClose: () => void;
  id?: string;
}


export function Modal({ id = 'modal' ,children, onClose }:ModalProps) {

  const handleOutsideClick = (e)=>{
    if (e.target.id == id) onClose();
  }
  return (
    <div id='modal' className='tfamodal' onClick={handleOutsideClick}>
      <div className="tfamodal__container">
        <button onClick={onClose} className="tfamodal__container__closeButton"/>
        <div className="tfamodal__container__content">
          {children}
        </div>
      </div>
    </div>
  );
}

