import './CreateGroup.scss';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { GlobalContext } from '../../../../contexts/GlobalContext';
import { Dropzone } from '../../../Dropzone/Dropzone';
import { CreateGroupData } from '../../../../others/Interfaces/interfaces';
import { Checkbox } from '../../../Checkbox/Checkbox';
import { actionsChat } from '../../../../adapters/chat/chatState';
import { Image } from 'phosphor-react';

interface CreateGroupProps {
  setCreateGroupModal: Dispatch<SetStateAction<boolean>>
}

export function CreateGroup({ setCreateGroupModal }: CreateGroupProps) {
  const { api, config, intraData } = useContext(GlobalContext);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [privateGroup, setPrivateGroup] = useState<boolean>(false);
  const [placeHolder, setPlaceHolder] = useState('Group Name');
  const [password, setPassword] = useState('Password (Optional)');
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  async function handleSubmit(event: any,groupData: CreateGroupData) {
    const data = new FormData();
    data.append('name', 'chatImage');
    if (selectedFile) {
      data.append('file', selectedFile);
      groupData.image = selectedFile.name;
      await api.post('/chat/updateGroupImage', data, config);
    } else {
      groupData.image = 'userDefault.12345678.png';
    }
    await api.post('/chat/createGroup', groupData, config)
      .then((response) => {
        if (response.status === 201) {
          setCreateGroupModal(false);
          actionsChat.JoinNewGroup(response.data, intraData.email);
        }
      }).catch((err) => {
        event.target[0].value = '';
        event.target[1].value = '';
        event.target[2].value = '';
        setPlaceHolder(err.response.data.message);
      });
  }

  function handleKeyEnter(event: any) {
    event.preventDefault();
    if (event.target[0].value === '') {
      setPlaceHolder('Group need have a name');
      return;
    }

    let type = event.target[1].value !== '' ? 'protected' : 'public';
    if (event.target[3].ariaChecked === 'true') {
      type = 'private';
      event.target[1].value = '';
      event.target[2].value = '';
    }
    const groupData: CreateGroupData = {
      owner: intraData.login,
      name: event.target[0].value,
      type: type,
      password: event.target[1].value,
      confirmPassword: event.target[2].value,
    };
    handleSubmit(event, groupData);
    event.target[1].value = '';
    event.target[2].value = '';
  }

  return (
    <div className='createGroup'>
      <div className='createGroup__image'>
        {
          selectedFileUrl ?
            <img src={selectedFileUrl} className='createGroup__image__icon' alt='Image Preview' /> :
            <Image className='createGroup__image__icon' size={150} />
        }
        <div className='createGroup__button_text'>
          <Dropzone setSelectedFileUrl={setSelectedFileUrl} onFileUploaded={setSelectedFile} />
        </div>
      </div>
      <form autoComplete='off' className='createGroup__form' action="submit" onSubmit={handleKeyEnter}>
        <input
          className='createGroup__groupName'
          type="text"
          name="groupName"
          placeholder={placeHolder}
          style={{ border: placeHolder !== 'Group Name' ? '3px solid red' : 'none' }
          } />
        <input
          className='createGroup__groupPassword'
          type="text"
          name="groupPassword"
          placeholder={password}
          style={{ border: password !== 'Password (Optional)' ? '3px solid red' : 'none' }}
        />
        <input
          className='createGroup__groupPassword'
          type="text"
          name="groupPassword"
          placeholder='Confirm Password'
        />
        <label className='createGroup__private' htmlFor="">
          <span>Private Group</span>
          <Checkbox
            id='privateGroup'
            onCheckedChange={() => setPrivateGroup(!privateGroup)}
          />
        </label>
        <button className='createGroup__createButton'>Create Group</button>
      </form>
    </div>
  );
}