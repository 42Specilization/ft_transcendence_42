import { XCircle } from 'phosphor-react';
import { Dispatch, SetStateAction, useContext } from 'react';
import { GroupConfig } from './GroupConfig';
import './GroupConfigModal.scss';
import { IntraDataContext } from '../../contexts/IntraDataContext';

interface GroupConfigModalProps {
  id: string | undefined;
  setGroupConfigVisible: Dispatch<SetStateAction<boolean>>;
}

export function GroupConfigModal({ id, setGroupConfigVisible }: GroupConfigModalProps) {
  const {api, config} = useContext(IntraDataContext)
  
  const handleOutsideClick = (e: any) => {
    if (e.target.id == 'groupConfig__modal')
      setGroupConfigVisible(false);
  };



  return (
    <div id='groupConfig__modal' className='groupConfig__modal' onClick={handleOutsideClick}>
      <div className="groupConfig__modal__container">
        <div className="groupConfig__modal__container__content">
          <GroupConfig id={id} />
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