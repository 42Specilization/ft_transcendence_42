import './CardGroup.scss';
import { DotsThreeVertical, LockKey, Shield, SignIn, SignOut, TelegramLogo } from 'phosphor-react';
import { useContext, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { ChatContext } from '../../../contexts/ChatContext';
import { GroupCardData } from '../../../others/Interfaces/interfaces';
import { Link } from 'react-router-dom';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { actionsChat } from '../../../adapters/chat/chatState';
import { ProfileGroupModal } from '../../ProfileGroupModal/ProfileGroupModal';
import { Modal } from '../../Modal/Modal';
import { getUrlImage } from '../../../others/utils/utils';
import { ConfirmActionModal } from '../../ConfirmActionModal/ConfirmActionModal';

interface CardGroupProps {
  group: GroupCardData;
}

export function CardGroup({ group }: CardGroupProps) {

  const { api, config, intraData } = useContext(IntraDataContext);
  const { setSelectedChat } = useContext(ChatContext);
  const [activeMenu, setActiveMenu] = useState(false);
  const [profileGroupVisible, setProfileGroupVisible] = useState(false);
  const [groupSecurityJoinVisible, setGroupSecurityJoinVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [placeHolder, setPlaceHolder] = useState('');
  const [confirmActionVisible, setConfirmActionVisible] = useState('');
  
  function handleSendMessage() {
    setSelectedChat({ chat: group.id, type: 'group' });
  }

  async function handleJoinGroup() {
    if (group.type === 'protected' && password.trim()){
      try{
        await api.patch('/chat/confirmPassword', { groupId: group.id, password: password }, config);
      } catch(err: any){
        setPassword('');
        setPlaceHolder(err.response.data.message);
      }

    }
    actionsChat.joinGroup(group.id, intraData.email);
  }

  function selectJoinGroup() {
    if (group.type === 'protected') {
      setGroupSecurityJoinVisible(true);
    } else {
      handleJoinGroup();
    }
  }

  function handleLeaveGroup() {
    actionsChat.leaveGroup(group.id, intraData.email);
  }

  function selectProfileGroupVisible(e: any) {
    if (e.target.id === 'card__group__community') {
      setProfileGroupVisible((prev) => !prev);
    }
  }

  return (
    <>
      <div id='card__group__community' className='card__group__community'
        onClick={(e) => selectProfileGroupVisible(e)}
      >
        <div id='card__group__community' className='card__group__community__icon'
          style={{ backgroundImage: `url(${getUrlImage(group.image)})` }}>
        </  div>
        <div id='card__group__community' className='card__group__community__name'>{group.name}</div>

        <div className='card__group__community__menu__div'>
          <div
            style={{ paddingRight: '20px' }}
          >
            {(() => {
              if (group.type === 'private') {
                return <LockKey size={32}
                  data-html={true}
                  data-tip={'Private Group'} />;
              }
              else if (group.type === 'protected')
                return <Shield size={32}
                  data-html={true}
                  data-tip={'Protected Group'} />;
            })()}
          </  div>

          <div className='card__group__community__menu'>
            {group.member ?
              <div id='card__group__community__menu__body' className='card__group__community__menu__body'
                style={{ height: activeMenu ? '100px' : '0px', width: activeMenu ? '80px' : '0px' }}>
                <Link to='/chat'>
                  <button className='card__group__community__menu__button'
                    onClick={handleSendMessage}
                    data-html={true}
                    data-tip={'Send Message'}
                  >
                    <TelegramLogo size={32} />
                  </  button>
                </  Link>
                <button className='card__group__community__menu__button'
                  onClick={()=> setConfirmActionVisible('leave')}
                  data-html={true}
                  data-tip={'Leave Group'}
                >
                  <SignOut size={32} />
                </  button>
              </  div>
              :
              <div id='card__group__community__menu__body' className='card__group__community__menu__body'
                style={{ height: activeMenu ? '55px' : '0px', width: activeMenu ? '80px' : '0px' }}>
                <button className='card__group__community__menu__button'
                  onClick={selectJoinGroup}
                  data-html={true}
                  data-tip={'Join Group'}
                >
                  <SignIn size={32} />
                </  button>
              </  div>
            }
            <DotsThreeVertical
              id='card__group__community__menu'
              className='card__group__community__header__icon'
              size={40}
              onClick={() => setActiveMenu(prev => !prev)}
              data-html={true}
              data-tip={'Menu'}
            />
          </  div>
          <ReactTooltip delayShow={50} />
          {
            profileGroupVisible &&
            <ProfileGroupModal id={group.id} setProfileGroupVisible={setProfileGroupVisible} />
          }
        </  div>
      </  div >
      {
        groupSecurityJoinVisible &&
        <Modal
          id='card__group__community__modal__security'
          onClose={() => setGroupSecurityJoinVisible(false)}
        >
          <h3>Insert a password</h3>
          <input
            className='group__changeSecurity__modal__input'
            type='password'
            value={password}
            placeholder={placeHolder}
            style={{ border: placeHolder !== '' ? '3px solid red' : 'none' }}
            onChange={(e) => {
              setPassword(e.target.value);
              setPlaceHolder('');
            }}
            ref={e => e?.focus()}
          />
          <button
            className='group__changeSecurity__modal__button'
            onClick={handleJoinGroup}
          >
            Join
          </button>
        </Modal>
      }
      {(() => {
        if (confirmActionVisible === 'leave'){
          return <ConfirmActionModal
            title={'Leave group?'}
            onClose={() => setConfirmActionVisible('')}
            confirmationFunction={handleLeaveGroup}
          />;
        }       
      })()}

      
    </>
  );
}