import './GroupsTab.scss';
import { Plus } from 'phosphor-react';
import { useState, useContext } from 'react';
import ReactTooltip from 'react-tooltip';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { CardGroup } from './CardGroup/CardGroup';
import { Modal } from '../../Modal/Modal';
import { CreateGroup } from './CreateGroup/CreateGroup';
import { useQuery } from 'react-query';
import { ChatContext } from '../../../contexts/ChatContext';
import { ButtonSearch } from '../../Button/ButtonSearch';

export function GroupsTab() {

  const [searchActive, setSearchActive] = useState(false);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { api, config } = useContext(IntraDataContext);
  const { updateGroup } = useContext(ChatContext);

  const { data, status } = useQuery(
    ['getAllCardGroup', updateGroup],
    async () => {
      const response = await api.get('/chat/getAllCardGroup', config);
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: true,
    }
  );

  if (status === 'loading')
    return (<div className='groups__tab' />);

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
        {data &&
          data.map((key: any) => <CardGroup key={Math.random()} group={key} />)
        }
      </div>
      {createGroupModal &&
        <Modal id='createGroupModal' onClose={() => (setCreateGroupModal(false))}>
          <CreateGroup setCreateGroupModal={setCreateGroupModal} />
        </Modal>
      }
    </div >);
}