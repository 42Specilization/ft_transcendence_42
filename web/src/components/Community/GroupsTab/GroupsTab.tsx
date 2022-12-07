import './GroupsTab.scss';
import { Plus } from 'phosphor-react';
import { useState, useContext } from 'react';
//import { Tooltip } from 'react-tooltip';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { CardGroup } from './CardGroup/CardGroup';
import { Modal } from '../../Modal/Modal';
import { CreateGroup } from './CreateGroup/CreateGroup';
import { ButtonSearch } from '../../Button/ButtonSearch';
import { ProfileGroupModal } from '../../ProfileGroup/ProfileGroupModal/ProfileGroupModal';

export function GroupsTab() {

  const [searchActive, setSearchActive] = useState(false);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { globalData } = useContext(GlobalContext);
  const [profileGroupVisible, setProfileGroupVisible] = useState('');

  return (
    <div className='groups__tab' >
      <div className='groups__tab__header'>
        <ButtonSearch
          width={'70%'}
          tooltip={'Search Group'}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          searchActive={searchActive}
          setSearchActive={setSearchActive} />
        <Plus
          size={40}
          style={{ display: searchActive ? 'none' : '' }}
          className='groups__tab__header__icon'
          onClick={() => setCreateGroupModal(true)}
        />
      </div>
      <div className='groups__tab__body'>
        {globalData.globalGroups?.map((key: any) =>
          <CardGroup key={Math.random()} group={key} setProfileGroupVisible={setProfileGroupVisible} />)
        }
      </div>
      {createGroupModal &&
        <Modal id='createGroupModal' onClose={() => (setCreateGroupModal(false))}>
          <CreateGroup setCreateGroupModal={setCreateGroupModal} />
        </Modal>
      }
      {profileGroupVisible !== '' &&
        <ProfileGroupModal id={profileGroupVisible} setProfileGroupVisible={setProfileGroupVisible} />
      }
    </div >);
}