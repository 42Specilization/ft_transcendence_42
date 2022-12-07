import './GroupsTab.scss';
import { Plus } from 'phosphor-react';
import { useState, useContext, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { CardGroup } from './CardGroup/CardGroup';
import { Modal } from '../../Modal/Modal';
import { CreateGroup } from './CreateGroup/CreateGroup';
import { ButtonSearch } from '../../Button/ButtonSearch';
import { ProfileGroupModal } from '../../ProfileGroup/ProfileGroupModal/ProfileGroupModal';

export function GroupsTab() {

  const [groupProfile, setGroupProfile] = useState('');
  const [searchActive, setSearchActive] = useState(false);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { globalData } = useContext(IntraDataContext);
  const [profileGroupVisible, setProfileGroupVisible] = useState(false);

  useEffect(() => {
    if (groupProfile !== '')
      setProfileGroupVisible(true);
  }, [groupProfile]);

  useEffect(() => {
    if (profileGroupVisible === false)
      setGroupProfile('');
  }, [profileGroupVisible]);

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
        <ReactTooltip delayShow={50} />
      </div>
      <div className='groups__tab__body'>
        {globalData.globalGroups?.map((key: any) =>
          <CardGroup key={Math.random()} group={key} setGroupProfile={setGroupProfile} />)
        }
      </div>
      {createGroupModal &&
        <Modal id='createGroupModal' onClose={() => (setCreateGroupModal(false))}>
          <CreateGroup setCreateGroupModal={setCreateGroupModal} />
        </Modal>
      }
      {profileGroupVisible &&
        <ProfileGroupModal id={groupProfile} setProfileGroupVisible={setProfileGroupVisible} />
      }
    </div >);
}