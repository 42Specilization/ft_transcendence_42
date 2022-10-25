import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IntraData } from '../../Interfaces/interfaces';
import { getStoredData } from '../../pages/Home/Home';

interface DropzoneProps {
  onFileUploaded: (file: File) => void;
  setIntraData: Dispatch<SetStateAction<IntraData>>;
}

export function Dropzone({ onFileUploaded, setIntraData }: DropzoneProps) {
  const onDrop = useCallback(
    (acceptepFiles) => {
      const localStore : string | null = window.localStorage.getItem('userData');
      if (localStore){
        const data: IntraData = JSON.parse(localStore);
        console.log('Dropzone', data);
        const file = new File([acceptepFiles[0]], `${data.login}_avatar.jpg`);
        onFileUploaded(file);
        window.localStorage.removeItem('userData');
        getStoredData(setIntraData);
        window.location.reload();
      }
    },
    [onFileUploaded]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      <p>Change Image</p>
    </div>
  );
}
