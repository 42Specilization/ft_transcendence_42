import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  onFileUploaded: (file: File) => void;
  login : string;
}

export function Dropzone ({onFileUploaded, login} :DropzoneProps) {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(acceptepFiles => {
    const file = acceptepFiles[0];
    const fileUrl = URL.createObjectURL(file);
    setSelectedFileUrl(fileUrl);

    onFileUploaded(file);
  }, [onFileUploaded]);

  async function handleSubmit(file: File) {

    const data = new FormData();
    data.append('name', login+'profile');
    if (file){
      data.append('image', file);
    }
    const api = axios.create({baseURL: `http://${import.meta.env.VITE_API_URL}:3000/`})
    await api.post('/public/', data);
  }

  const {getRootProps, getInputProps} = useDropzone({onDrop, accept:{
    'image/jpeg':['.jpg'],
    'image/png':['.png'],
    'image/gif':['.gif'],
  }});
  return (
    <div { ...getRootProps()}>
      <input {...getInputProps()} accept='image/*' />
      {
        <p>Change Image</p>
      }
    </div>
  );
}
