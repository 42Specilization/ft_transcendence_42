import './UserImage.scss';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { useSnapshot } from 'valtio';
import { stateStatus } from '../../../adapters/status/statusState';
import { Dropzone } from './Dropzone';

export function UserImage() {

  const { intraData, updateImageTime } = useContext(IntraDataContext);
  const [selectedFile, setSelectedFile] = useState<File>();
  const currentStateStatus = useSnapshot(stateStatus);
  async function handleSubmit() {
    const token = window.localStorage.getItem('token');
    const data = new FormData();
    data.append('name', intraData.login);
    if (selectedFile) {
      data.append('file', selectedFile);
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const api = axios.create({
      baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
    });
    await api.post('/user/updateImage', data, config);
    console.log(selectedFile?.name);
    currentStateStatus.socket?.emit('changeImage', selectedFile?.name);
    // window.location.reload();
  }

  useEffect(() => {
    if (selectedFile) handleSubmit();
  }, [selectedFile]);

  return (
    <div className='userImage__image'>
      <img src={`${intraData.image_url}?${updateImageTime}`} alt='User Image' />
      <div className='userImage__button_text'>
        <Dropzone onFileUploaded={setSelectedFile} />
      </div>
    </div>
  );
}
