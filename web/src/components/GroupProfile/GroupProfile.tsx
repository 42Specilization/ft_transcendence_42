import './GroupProfile.scss';
import { NotePencil, Prohibit, UsersThree } from 'phosphor-react';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { actionsChat } from '../../adapters/chat/chatState';
import { ChatContext } from '../../contexts/ChatContext';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { CardAdmin } from './CardAdmin/CardAdmin';
import { CardMember } from './CardMember/CardMember';
import { CardOwner } from './CardOwner/CardOwner';
import { ChangeName } from './ChangeName/ChangeName';
import { Dropzone } from '../Dropzone/Dropzone';
import { ChangeSecurity } from './ChangeSecurity/ChangeSecurity';
import { CardBanned } from './CardBanned/CardBanned';
import { getUrlImage } from '../../others/utils/utils';
import ReactTooltip from 'react-tooltip';
import { ButtonSendMessage } from '../Button/ButtonSendMessage';
import { ButtonJoinGroup } from '../Button/ButtonJoinGroup';
import { ButtonLeaveGroup } from '../Button/ButtonLeaveGroup';
import { ButtonInviteMember } from '../Button/ButtonInviteMember';
import { actionsStatus } from '../../adapters/status/statusState';

interface GroupProfileProps {
  id: string | undefined;
}

export function GroupProfile({ id }: GroupProfileProps) {

  const { api, config } = useContext(IntraDataContext);
  const { updateGroup } = useContext(ChatContext);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [modalChangeName, setModalChangeName] = useState(false);
  const [modalChangeSecurity, setModalChangeSecurity] = useState(false);
  const [bannedVisible, setBannedVisible] = useState(false);

  const { data, status } = useQuery(
    ['getGroupInfos', updateGroup],
    async () => {
      const response = await api.patch('/chat/getProfileGroupById', { id: id }, config);
      // console.log(response.data);
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: true,
    }
  );


  useEffect(() => {
    if (selectedFile)
      handleSubmit();
  }, [selectedFile]);

  async function handleSubmit() {
    const file = new FormData();
    file.append('name', data.name);
    if (selectedFile) {
      file.append('file', selectedFile);
      await api.post('/chat/updateGroupImage', file, config);
      await api.patch('/chat/updateGroup', { id: data.id, image: selectedFile.name }, config);
    }
    actionsChat.updateGroup();
  }

  function getPermission(level: string) {
    if (level === 'maxLevel')
      return data.role === 'owner';
    if (level === 'middleLevel')
      return data.role === 'owner' || data.role === 'admin';
    if (level === 'lowLevel')
      return data.role !== 'outside';
    return false;
  }

  if (status === 'loading')
    return <div className='group__profile' />;

  return (
    <div className='group__profile'>
      <div className='group__profile__infos'>
        <div className='group__profile__infos__image'>
          <img src={getUrlImage(data.image)} alt="Group Image" />
          {getPermission('middleLevel') &&
            <div className='group__profile__infos__image__text'>
              <Dropzone onFileUploaded={setSelectedFile} />
            </div>
          }
        </div>
        <div className='group__profile__infos__name'>
          <strong>{data.name}</strong>
          {getPermission('middleLevel') &&
            <div className='group__profile__infos__name__button'>
              <NotePencil size={30} onClick={() => setModalChangeName(true)} />
              {modalChangeName &&
                <ChangeName id={id} setModalChangeName={setModalChangeName} />
              }
            </div>
          }
        </div>
        {getPermission('maxLevel') &&
          <>
            <button className='group__profile__infos__security__button'
              onClick={() => { setModalChangeSecurity(true); }}
            >
              Change Security
            </button>
            {modalChangeSecurity &&
              <ChangeSecurity id={id} setModalChangeSecurity={setModalChangeSecurity} />
            }
          </>
        }
      </div >

      <div className='group__profile__members'>
        <div className='group__profile__buttons'>
          {getPermission('lowLevel') &&
            <ButtonSendMessage id={data.id} type={'group'} />
          }
          {getPermission(data.type === 'public' ? 'lowLevel' : 'middleLevel') &&
            <ButtonInviteMember id={data.id} />
          }
          {getPermission('lowLevel') ?
            <ButtonLeaveGroup id={data.id} /> :
            <ButtonJoinGroup id={data.id} type={data.type} />
          }
          {getPermission('middleLevel') &&
            <button className='button__icon'
              onClick={() => setBannedVisible(prev => !prev)}
              data-html={true}
              data-tip={bannedVisible ? 'Member List' : 'Banned List'}
            >
              {bannedVisible ?
                <UsersThree size={32} /> :
                <Prohibit size={32} />
              }
            </button>
          }
        </div>
        <div className='group__profile__members__body'>
          <>
            {(data.members && !bannedVisible) &&
              data.members.map((obj: any) => {
                if (obj.role === 'owner')
                  return <CardOwner key={Math.random()} member={obj} />;
                if (obj.role === 'admin')
                  return <CardAdmin key={Math.random()} id={data.id}
                    member={obj} getPermission={getPermission} />;
                else
                  return <CardMember key={Math.random()} id={data.id}
                    member={obj} getPermission={getPermission} />;
              })
            }
            {(data.banned && bannedVisible) &&
              data.banned.map((obj: any) => {
                return <CardBanned key={Math.random()} id={data.id} banned={obj} />;
              })
            }
          </>
        </div>
      </div>
      <ReactTooltip delayShow={50} />
    </div >
  );
}