import { XCircle } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';
import { GroupInfo } from './GroupInfo';
import './GroupInfoModal.scss';

interface GroupInfoModalProps {
  id: string | undefined;
  setGroupInfoVisible: Dispatch<SetStateAction<boolean>>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function GroupInfoModal({ id, setGroupInfoVisible }: GroupInfoModalProps) {
  const handleOutsideClick = (e: any) => {
    if (e.target.id == 'groupInfo__modal')
      setGroupInfoVisible(false);
  };

  return (
    <div id='groupInfo__modal' className='groupInfo__modal' onClick={handleOutsideClick}>
      <div className="groupInfo__modal__container">
        <div className="groupInfo__modal__container__content">
          <GroupInfo id={id}/>
        </div>
        <div className='groupInfo__modal__container__closeButton__div' >
          <button className="groupInfo__modal__container__closeButton"
            onClick={()=> setGroupInfoVisible(false)}>
            <XCircle size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}