import './ProfileGroup.scss';
import { NotePencil, Prohibit, UsersThree } from 'phosphor-react';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { GlobalContext } from '../../contexts/GlobalContext';
import { CardMember } from './CardMember/CardMember';
import { ChangeName } from './ChangeName/ChangeName';
import { Dropzone } from '../Dropzone/Dropzone';
import { ChangeSecurity } from './ChangeSecurity/ChangeSecurity';
import { getUrlImage } from '../../others/utils/utils';
import { ButtonSendMessage } from '../Button/ButtonSendMessage';
import { ButtonJoinGroup } from '../Button/ButtonJoinGroup';
import { ButtonLeaveGroup } from '../Button/ButtonLeaveGroup';
import { ButtonInviteMember } from '../Button/ButtonInviteMember';
import { actionsStatus } from '../../adapters/status/statusState';
import { UserData } from '../../others/Interfaces/interfaces';
import { ProfileUserModal } from '../ProfileUser/ProfileUserModal/ProfileUserModal';
import ReactTooltip from 'react-tooltip';


interface ProfileGroupProps {
  id: string | undefined;
  setProfileGroupVisible: Dispatch<SetStateAction<string>>;
}

export function ProfileGroup({ id, setProfileGroupVisible }: ProfileGroupProps) {

  const { api, config, updateUserProfile, updateGroupProfile, closeGroupProfile, setCloseGroupProfile } = useContext(GlobalContext);
  const [updateQuery, setUpdateQuery] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [modalChangeName, setModalChangeName] = useState(false);
  const [modalChangeSecurity, setModalChangeSecurity] = useState(false);
  const [bannedVisible, setBannedVisible] = useState(false);
  const [profileUserVisible, setProfileUserVisible] = useState('');

  useEffect(() => {
    if (updateUserProfile.newLogin && updateUserProfile.login === profileUserVisible)
      setProfileUserVisible(updateUserProfile.newLogin);
    if (data && data.members && data.members.map((e: UserData) => e.login).indexOf(updateUserProfile.login) >= 0)
      setUpdateQuery(updateUserProfile.change);
  }, [updateUserProfile]);

  useEffect(() => {
    if (updateGroupProfile.id === id)
      setUpdateQuery(updateGroupProfile.change);
  }, [updateGroupProfile]);

  useEffect(() => {
    if (closeGroupProfile.id === id) {
      setProfileGroupVisible('');
      setCloseGroupProfile({ change: 0, id: '' });
    }
  }, [closeGroupProfile]);

  const { data, status } = useQuery(
    ['getGroupInfos', updateQuery],
    async () => {
      const response = await api.patch('/chat/getProfileGroupById', { id: id }, config);
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
      actionsStatus.changeGroupImage(data.id, selectedFile.name);
    }
  }

  function havePermission(level: string) {
    if (level === 'maxLevel')
      return data.role === 'owner';
    if (level === 'middleLevel')
      return data.role === 'owner' || data.role === 'admin';
    if (level === 'lowLevel')
      return data.role === 'owner' || data.role === 'admin' || data.role === 'member';
    if (level === 'nonLevel')
      return data.role === 'banned';
    return false;
  }

  if (status === 'loading')
    return <div className='profileGroup' />;

  if (!data) {
    return (
      <div className='profileGroup__notFound'>
        <h1>Profile Group Not Found</h1>
      </div>
    );
  }

  return (
    <>
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
              <ButtonSendMessage id={data.id} type={'group'} onClick={() => setProfileGroupVisible('')} />
            }
            {havePermission(data.type === 'public' ? 'lowLevel' : 'middleLevel') &&
              <ButtonInviteMember id={data.id} />
            }
            {havePermission('middleLevel') &&
              <>
                <button
                  id='members_or_banned_tab'
                  className='button__icon'
                  onClick={() => setBannedVisible(prev => !prev)}
                  data-tip={bannedVisible ? 'Member List' : 'Banned List'}
                >
                  {bannedVisible ?
                    <UsersThree size={32} /> :
                    <Prohibit size={32} />
                  }
                </button>
                <ReactTooltip delayShow={50} />
              </>
            }
          </div>
          <CardMember data={data} bannedVisible={bannedVisible} havePermission={havePermission} setProfileUserVisible={setProfileUserVisible} />
          <div className='profileGroup__buttons__button'>
            {!havePermission('nonLevel') &&
              <>
                {havePermission('lowLevel') ?
                  <ButtonLeaveGroup id={data.id} onLeave={() => setProfileGroupVisible('')} /> :
                  <ButtonJoinGroup id={data.id} type={data.type} />
                }
              </>
            }
          </div>
        </div>
        <ReactTooltip />
      </div>
      {
        profileUserVisible !== '' &&
        <ProfileUserModal login={profileUserVisible}
          setProfileUserVisible={setProfileUserVisible} />
      }
    </>
  );
}