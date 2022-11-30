import { XCircle } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';
import { GroupConfig } from './GroupConfig/GroupConfig';
import './GroupConfigModal.scss';

interface GroupConfigModalProps {
  id: string | undefined;
  setGroupConfigVisible: Dispatch<SetStateAction<boolean>>;
}

export function GroupConfigModal({ id, setGroupConfigVisible }: GroupConfigModalProps) {

  const handleOutsideClick = (e: any) => {
    if (e.target.id == 'groupConfig__modal')
      setGroupConfigVisible(false);
  };

  return (
    <div id='groupConfig__modal' className='groupConfig__modal' onClick={handleOutsideClick}>
      <div className="groupConfig__modal__container">
        <div className="groupConfig__modal__container__content">
          <GroupConfig id={id} setGroupConfigVisible={setGroupConfigVisible} />
        </div>
        <div className='groupConfig__modal__container__closeButton__div' >
          <button className="groupConfig__modal__container__closeButton"
            onClick={() => setGroupConfigVisible(false)}>
            <XCircle size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}