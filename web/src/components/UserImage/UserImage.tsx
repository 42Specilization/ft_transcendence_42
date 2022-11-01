import './UserImage.scss';
import { Dropzone } from '../Dropzone/Dropzone';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import { IntraData } from '../../Interfaces/interfaces';

interface UserImageProps {
  image_url: string;
  login: string;
  setIntraData: Dispatch<SetStateAction<IntraData>>;
}

export function UserImage({ image_url, login, setIntraData }: UserImageProps) {
  const [selectedFile, setSelectedFile] = useState<File>();
  async function handleSubmit() {
    const token = window.localStorage.getItem('token');
    const data = new FormData();
    data.append('name', login);
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
    <div className="userImage__image">
      <img src={image_url} alt="User Image" />
      <div className="userImage__button_text">
        <Dropzone
          onFileUploaded={setSelectedFile}
          setIntraData={setIntraData}
        />
      </div>
    </div>
  );
}
