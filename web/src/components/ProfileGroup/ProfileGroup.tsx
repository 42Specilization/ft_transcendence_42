import './ProfileGroup.scss';
import ReactTooltip from 'react-tooltip';
import { NotePencil, Prohibit, UsersThree } from 'phosphor-react';
import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { actionsChat } from '../../adapters/chat/chatState';
import { ChatContext } from '../../contexts/ChatContext';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import { CardMember } from './CardMember/CardMember';
import { ChangeName } from './ChangeName/ChangeName';
import { Dropzone } from '../Dropzone/Dropzone';
import { ChangeSecurity } from './ChangeSecurity/ChangeSecurity';
import { getUrlImage } from '../../others/utils/utils';
import { ButtonSendMessage } from '../Button/ButtonSendMessage';
import { ButtonJoinGroup } from '../Button/ButtonJoinGroup';
import { ButtonLeaveGroup } from '../Button/ButtonLeaveGroup';
import { ButtonInviteMember } from '../Button/ButtonInviteMember';


interface ProfileGroupProps {
  id: string | undefined;
}

export function ProfileGroup({ id }: ProfileGroupProps) {

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
      console.log(updateGroup)
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: false,
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
    actionsChat.getUpdateGroup(id as string);
  }

  function havePermission(level: string) {
    if (level === 'maxLevel')
      return data.role === 'owner';
    if (level === 'middleLevel')
      return data.role === 'owner' || data.role === 'admin';
    if (level === 'lowLevel')
      return data.role !== 'outside' || data.role !== 'banned';
    if (level === 'nonLevel')
      return data.role !== 'banned';
    return false;
  }

  if (status === 'loading')
    return <div className='profileGroup' />;

  return (
    <div className='profileGroup'>
      <div className='profileGroup__infos'>
        <div className='profileGroup__infos__image'>
          <img src={getUrlImage(data.image)} alt="Group Image" />
          {havePermission('middleLevel') &&
            <div className='profileGroup__infos__image__text'>
              <Dropzone onFileUploaded={setSelectedFile} />
            </div>
          }
        </div>
        <div className='profileGroup__infos__name'>
          <strong>{data.name}</strong>
          {havePermission('middleLevel') &&
            <div className='profileGroup__infos__name__button'>
              <NotePencil size={30} onClick={() => setModalChangeName(true)} />
              {modalChangeName &&
                <ChangeName id={id} setModalChangeName={setModalChangeName} />
              }
            </div>
          }
        </div>
        {havePermission('maxLevel') &&
          <>
            <button className='profileGroup__infos__security__button'
              onClick={() => setModalChangeSecurity(true)}
            >
              Change Security
            </button>
            {modalChangeSecurity &&
              <ChangeSecurity id={id} setModalChangeSecurity={setModalChangeSecurity} />
            }
          </>
        }
      </div >

      <div className='profileGroup__members'>
        <div className='profileGroup__buttons__top'>
          {havePermission('lowLevel') &&
            <ButtonSendMessage id={data.id} type={'group'} />
          }
          {havePermission(data.type === 'public' ? 'lowLevel' : 'middleLevel') &&
            <ButtonInviteMember id={data.id} />
          }
          {havePermission('middleLevel') &&
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
        <CardMember data={data} bannedVisible={bannedVisible} havePermission={havePermission} />
        <div className='profileGroup__buttons__botton'>
          {havePermission('nonLevel') ?
            <ButtonLeaveGroup id={data.id} /> :
            <ButtonJoinGroup id={data.id} type={data.type} />
          }
        </div>
      </div>
      <ReactTooltip delayShow={50} />
    </div >
  );
}