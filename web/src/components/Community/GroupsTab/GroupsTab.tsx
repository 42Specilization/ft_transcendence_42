import './GroupsTab.scss';
import { MagnifyingGlass, Plus, X } from 'phosphor-react';
import { useState, useContext } from 'react';
import ReactTooltip from 'react-tooltip';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { CardGroup } from '../CardGroup/CardGroup';
import { Modal } from '../../Modal/Modal';
import Dropzone from 'react-dropzone';
import { CreateGroup } from './CreateGroup/CreateGroup';

export function GroupsTab() {

  const [isTableSearch, setIsTableSearch] = useState(false);
  const [createGroupModal, setCreateGroupModal] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const { intraData } = useContext(IntraDataContext);

  return (
    < div className='groups__tab' >
      <div
        className='groups__tab__header'>
        <div className='groups__tab__header__search'
          style={{ width: isTableSearch ? '70%' : '40px' }}>
          < MagnifyingGlass className='groups__tab__header__icon'
            size={40}
            data-html={true}
            data-tip={'Search Blocked'}
            onClick={() => {
              setIsTableSearch(prev => !prev);
              setSearchInput('');
            }}
          />
          <input
            className='groups__tab__header__search__input'
            maxLength={15}
            value={searchInput}
            onChange={(msg) => {
              setSearchInput(msg.target.value);
            }}
            ref={e => { if (isTableSearch) e?.focus(); }}
          />
          <X
            className='groups__tab__header__icon'
            size={40}
            onClick={() => setSearchInput('')}
          />
        </div>
        <Plus 
          size={40} 
          style={{ display: isTableSearch ? 'none' : '' }} 
          className='groups__tab__header__icon' 
          onClick={()=> setCreateGroupModal(true)}
        />
        <ReactTooltip delayShow={50} />
      </div>
      <div className='groups__tab__body'>
        {
          intraData.friends?.sort((a, b) => a.login < b.login ? -1 : 1)
            .map(() => <CardGroup key={Math.random()} group={{
              name: 'mock',
              image_url: 'userDefault.png',
            }} />)
        }
      </div>
      {createGroupModal && 
      <Modal id='createGroupModal' onClose={()=>(setCreateGroupModal(false))}>
        <CreateGroup setCreateGroupModal={setCreateGroupModal} />
      </Modal>
      }
    </div >);
}