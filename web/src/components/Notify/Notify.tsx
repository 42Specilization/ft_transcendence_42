import './Notify.scss';
import ReactTooltip from 'react-tooltip';
import { useContext } from 'react';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { NotifyData } from '../../others/Interfaces/interfaces';
import { CardNotify } from './CardNotify/CardNotify';
import { ButtonBlockUser } from '../Button/ButtonBlockUser';
import { ButtonNotifyProfile } from '../Button/ButtonNotifyProfile';
import { actions } from '../../adapters/game/gameState';
import { ButtonNotifyAction } from '../Button/ButtonNotifyAction';
import { actionsChat } from '../../adapters/chat/chatState';
import { actionsStatus } from '../../adapters/status/statusState';

export function Notify() {

  const { api, config, intraData, globalData, setGlobalData } = useContext(IntraDataContext);

  async function removeNotify(id: string) {
    await api.patch('/user/removeNotify', { id: id }, config);
    setGlobalData((prev) => {
      return {
        ...prev,
        notify: prev.notify.filter((key) => key.id != id)
      };
    });
    actionsStatus.removeNotify();
  }

  async function handleAcceptFriend(notify: NotifyData) {
    try {
      await api.patch('/user/acceptFriend', { id: notify.id }, config);
      removeNotify(notify.id);
      actionsStatus.newFriend(notify.user_source);
    } catch (err: any) {
      if (err.response.data.message == 'User already is your friend') {
        removeNotify(notify.id);
      }
    }
  }

  async function handleAcceptGroup(notify: NotifyData) {
    try {
      await api.patch('/user/removeNotify', { id: notify.id }, config);
      removeNotify(notify.id);
      actionsChat.joinGroup(notify.additional_info, intraData.email);
    } catch (err: any) {
      if (err.response.data.message == 'User already is your friend') {
        removeNotify(notify.id);
      }
    }
  }

  async function handleAcceptChallenge(notify: NotifyData) {
    actions.initializeSocket();
    actions.acceptChallenge(Number(notify.additional_info), intraData.login, notify.user_source);
    await api.patch('/user/removeNotify', { id: notify.id }, config);
    removeNotify(notify.id);
  }

  async function handleRejectChallenge(notify: NotifyData) {
    actions.initializeSocket();
    actions.rejectChallenge(notify.additional_info);
    actions.disconnectSocket();
    removeNotify(notify.id);
  }

  return (
    <div className='notify__body'>
      <>
        {globalData.notify.length > 0 ?
          globalData.notify.sort((a, b) => (a.date > b.date) ? -1 : 1)
            .map((obj: NotifyData) => {
              if (obj.type === 'friend')
                return (
                  <CardNotify notify={obj} message='send you a friend request'>
                    <ButtonNotifyAction type={'Accept'} handle={handleAcceptFriend} params={[obj]} />
                    <ButtonNotifyAction type={'Reject'} handle={removeNotify} params={[obj.id]} />
                    <ButtonNotifyProfile id={obj.user_source} type='User' />
                    <ButtonBlockUser login={obj.user_source} handle={removeNotify} params={[obj.id]} />
                  </CardNotify>
                );
              if (obj.type === 'group')
                return (
                  <CardNotify notify={obj} message='send you a group invite'>
                    <ButtonNotifyAction type={'Accept'} handle={handleAcceptGroup} params={[obj]} />
                    <ButtonNotifyAction type={'Reject'} handle={removeNotify} params={[obj.id]} />
                    <ButtonNotifyProfile id={obj.user_source} type='user' />
                    <ButtonNotifyProfile id={obj.additional_info} type='Group' />
                    <ButtonBlockUser login={obj.user_source} handle={removeNotify} params={[obj.id]} />
                  </CardNotify>
                );
              if (obj.type === 'challenge')
                return (
                  <CardNotify notify={obj} message='send you a challenge request'>
                    <ButtonNotifyAction type={'Accept'} handle={handleAcceptChallenge} params={[obj]} />
                    <ButtonNotifyAction type={'Reject'} handle={handleRejectChallenge} params={[obj]} />
                    <ButtonNotifyProfile id={obj.user_source} type='User' />
                    <ButtonBlockUser login={obj.user_source} handle={removeNotify} params={[obj.id]} />
                  </CardNotify>
                );
            })
          :
          <p className='notify__empty'>empty</p>
        }
        <ReactTooltip delayShow={50} />
      </>
    </div>
  );
}
