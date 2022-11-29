import { XCircle } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';
import { GroupInfos } from './GroupInfos';
import './GroupInfosModal.scss';

interface GroupInfosModalProps {
  id: string | undefined;
  setGroupInfosVisible: Dispatch<SetStateAction<boolean>>;
}

export function GroupInfosModal({ id, setGroupInfosVisible }: GroupInfosModalProps) {
  const handleOutsideClick = (e: any) => {
    if (e.target.id == 'groupInfos__modal')
      setGroupInfosVisible(false);
  };

  return (
    <div id='groupInfos__modal' className='groupInfos__modal' onClick={handleOutsideClick}>
      <div className="groupInfos__modal__container">
        <div className="groupInfos__modal__container__content">
          <GroupInfos id={id} />
        </div>
        <div className='groupInfos__modal__container__closeButton__div' >
          <button className="groupInfos__modal__container__closeButton"
            onClick={() => setGroupInfosVisible(false)}>
            <XCircle size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}