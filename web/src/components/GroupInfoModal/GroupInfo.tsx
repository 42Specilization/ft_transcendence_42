import { useQuery } from 'react-query';
import { useContext, useEffect, useState } from 'react';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import './GroupInfo.scss';
import { CardAdmin } from './CardAdmin';
import { CardMember } from './CardMember';
import { Dropzone } from '../Profile/UserImage/Dropzone';
import { NotePencil } from 'phosphor-react';
import { ChangeGroupName } from './ChangeGroupName';
import { Modal } from '../Modal/Modal';
import { SelectItem } from '../SelectItem/SelectItem';

interface GroupInfoProps {
  id: string | undefined;
}

export function GroupInfo({ id }: GroupInfoProps) {
  const { api, config } = useContext(IntraDataContext);
  const [changeSecurityType, setChangeSecurityType] = useState('');
  const [selectedFile, setSelectedFile] = useState<File>();
  const [isModalChangeGroupNameVisible, setIsModalChangeGroupNameVisible] = useState(false);
  const [isModalChangeSecurityVisible, setIsModalChangeSecurityVisible] = useState(false);
  const { data, status } = useQuery(
    'getGroupInfos',
    async () => {
      const response = await api.patch('/chat/getGroupInfosById', { id: id }, config);
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


  if (status === 'loading')
    return <div className='groupInfo' />;
  return (
    <div className='groupInfo'>

      <div className='groupInfo__infos'>
        <div className='groupInfo__infos__image'>
          <img src={data.image} alt="Group Image" />
          <div className='groupInfo__infos__image__text'>
            <Dropzone onFileUploaded={setSelectedFile} />
          </div>
        </div>
        <span>{data.name}
          <NotePencil size={30} onClick={() => setIsModalChangeGroupNameVisible(true)} />
        </span>
        <span>{data.owner.name}</span>
        <button
          className='groupInfo__infos__segurityButton'
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
            id='groupInfo__changeSecurity'
            onClose={() => setIsModalChangeSecurityVisible(false)}>
            <form
              className='groupInfo__changeSecurity'
              action=""
              onSubmit={handleSaveChangeSecurity}>
              <SelectItem onValueChange={(e) => setChangeSecurityType(e)} />
              {
                changeSecurityType === 'protected' &&
                < input
                  id='groupInfo__changeSecurity__input'
                  className='groupInfo__changeSecurity__input'
                  type="text"
                  placeholder='Password'
                />
              }
              <button
                type='submit'
                className='groupInfo__changeSecurity__saveButton'
                onSubmit={handleSaveChangeSecurity}>
                Save
              </button>
            </form>
          </Modal>
        }
      </div >


      <div className='groupInfo__members'>
        <div className='groupInfo__members__addMember'>
          <button > Add Member</button>
        </div>
        < div className='groupInfo__members__body'>
          {
            [...Array(20).keys()]
              .map((obj: any) => <CardAdmin key={crypto.randomUUID()} member={data.members[0]} />)
          }
          {
            [...Array(30).keys()]
              .map((obj: any) => <CardMember key={crypto.randomUUID()} member={data.members[0]} />)
          }
        </div>
      </div>
    </div >
  );
}