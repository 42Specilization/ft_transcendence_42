import { useQuery } from 'react-query';
import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import './GroupConfig.scss';
import { CardAdmin } from '../CardAdmin/CardAdmin';
import { CardMember } from '../CardMember/CardMember';
import { Dropzone } from '../../Profile/UserImage/Dropzone';
import { NotePencil } from 'phosphor-react';
import { ChangeGroupName } from '../ChangeGroupName/ChangeGroupName';
import { Modal } from '../../Modal/Modal';
import { SelectItem } from '../../SelectItem/SelectItem';
import { actionsStatus } from '../../../adapters/status/statusState';
import { actionsChat } from '../../../adapters/chat/chatState';
import { ChatContext } from '../../../contexts/ChatContext';

interface GroupConfigProps {
  id: string | undefined;
  setGroupConfigVisible: Dispatch<SetStateAction<boolean>>;
}

export function GroupConfig({ id, setGroupConfigVisible }: GroupConfigProps) {
  const { api, config, intraData } = useContext(IntraDataContext);
  const { setActiveChat, updateGroup } = useContext(ChatContext);
  const [changeSecurityType, setChangeSecurityType] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isModalChangeGroupNameVisible, setIsModalChangeGroupNameVisible] = useState(false);
  const [isModalChangeSecurityVisible, setIsModalChangeSecurityVisible] = useState(false);
  const [isModalAddMemberVisible, setIsModalAddMemberVisible] = useState(false);
  const [placeHolder, setPlaceHolder] = useState('Insert user name');

  const { data, status } = useQuery(
    ['getGroupInfos', updateGroup],
    async () => {
      const response = await api.patch('/chat/getProfileGroupById', { id: id }, config);
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: true,
    }
  );

  console.log(data);

  async function handleSubmit() {
    const file = new FormData();
    file.append('name', data.name);
    if (selectedFile) {
      file.append('file', selectedFile);
      await api.post('/chat/updateGroupImage', file, config);
      await api.patch('/chat/updateGroup', { id: data.id, image: selectedFile.name }, config);
    }

    // actionsStatus.changeImage(selectedFile?.name);
  }

  useEffect(() => {
    if (selectedFile) handleSubmit();
  }, [selectedFile]);

  async function handleSaveChangeSecurity(event: any) {
    event.preventDefault();
    console.log(changeSecurityType);
    let typedPassword = '';
    if (changeSecurityType.includes('protected')) {
      typedPassword = event.target[2].value as string;
      if (!typedPassword.trim()) {
        console.log('Digitar senha');
        return;
      }
    }
    await api.patch('/chat/updateGroup', { id: data.id, type: changeSecurityType, password: typedPassword }, config);
    setIsModalChangeSecurityVisible(false);
    setChangeSecurityType('');
  }

  async function sendGroupInvite() {
    try {
      console.log(inviteName);
      if (inviteName.trim()) {
        await api.patch('/chat/sendGroupInvite', { name: inviteName, groupId: data.id }, config);
        actionsStatus.newNotify(inviteName, 'group');
        setInviteName('');
        setIsModalAddMemberVisible(false);
      }
    } catch (err: any) {
      console.log(err);
      setInviteName('');
      setPlaceHolder('Invalid Name');
      // setModalErrorVisible(true);
    }
  }

  function handleLeaveGroup() {
    actionsChat.leaveGroup(data.id, intraData.email);
    setGroupConfigVisible(false);
    setActiveChat(null);
  }

  if (status === 'loading')
    return <div className='groupConfig' />;

  return (
    <div className='groupConfig'>

      <div className='groupConfig__infos'>
        <div className='groupConfig__infos__image'>
          <img src={data.image} alt="Group Image" />
          <div className='groupConfig__infos__image__text'>
            <Dropzone onFileUploaded={setSelectedFile} />
          </div>
        </div>
        <span>{data.name}
          <NotePencil size={30} onClick={() => setIsModalChangeGroupNameVisible(true)} />
        </span>
        <span>Owner: {data.owner.name}</span>
        <button
          className='groupConfig__infos__segurityButton'
          onClick={() => { setIsModalChangeSecurityVisible(true); }}
        >
          Change Security
        </button>
        {isModalChangeGroupNameVisible &&
          <ChangeGroupName
            id={data.id}
            setIsModalChangeGroupNameVisible={setIsModalChangeGroupNameVisible}
          />
        }
        {isModalChangeSecurityVisible &&
          <Modal
            id='groupConfig__changeSecurity'
            onClose={() => setIsModalChangeSecurityVisible(false)}>
            <form
              className='groupConfig__changeSecurity'
              action=""
              onSubmit={handleSaveChangeSecurity}>
              <SelectItem onValueChange={(e) => setChangeSecurityType(e)} />
              {
                changeSecurityType === 'protected' &&
                < input
                  id='groupConfig__changeSecurity__input'
                  className='groupConfig__changeSecurity__input'
                  type="text"
                  value={inviteName}
                  placeholder='Password'

                />
              }
              <button
                type='submit'
                className='groupConfig__changeSecurity__saveButton'
                onSubmit={handleSaveChangeSecurity}>
                Save
              </button>
            </form>
          </Modal>
        }
      </div >


      <div className='groupConfig__members'>
        <div className='groupConfig__members__action'>
          <button
            onClick={() => { setIsModalAddMemberVisible(true); }}
          > Add Member
          </button>
        </div>
        < div className='groupConfig__members__body'>

          {
            // data.admins.map((obj: any) => <CardAdmin key={crypto.randomUUID()} id={data.id} member={obj} />)
            data.members &&
            data.members.map((obj: any) => {
              console.log(obj)
              if (obj.role === 'admin')
                return <CardAdmin key={crypto.randomUUID()} id={data.id} member={obj} />;
              else
                return <CardMember key={crypto.randomUUID()} id={data.id} member={obj} />;
            })
          }
        </div>
        <div className='groupConfig__members__action'>
          <button
            onClick={handleLeaveGroup}
          >
            Leave
          </button>
        </div>
        {isModalAddMemberVisible &&
          <Modal
            id='groupConfig__members__addMember'
            onClose={() => setIsModalAddMemberVisible(false)}>
            <span style={{
              fontSize: '30px'
            }}>Insert a name</span>
            < input
              className='groupConfig__members__addMember__input'
              type="text"
              value={inviteName}
              maxLength={15}
              placeholder={placeHolder}
              style={{
                border: placeHolder !== '' ? '3px solid red' : 'none'
              }}
              onChange={(e) => {
                setInviteName(e.target.value);
                setPlaceHolder('');
              }}
            />
            <button
              className='groupConfig__members__addMember__button'
              onClick={sendGroupInvite}
            >Send</button>
          </Modal>
        }
      </div>
    </div >
  );
}