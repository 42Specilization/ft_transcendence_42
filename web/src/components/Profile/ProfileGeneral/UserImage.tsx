import './UserImage.scss';
import axios from 'axios';
import { Dropzone } from '../../Dropzone/Dropzone';
import { useContext, useEffect, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';

interface UserImageProps {

}

export function UserImage({ }: UserImageProps) {

  const { intraData, updateImageTime } = useContext(IntraDataContext);
  const [selectedFile, setSelectedFile] = useState<File>();

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
