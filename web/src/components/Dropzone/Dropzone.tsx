import { NotePencil } from 'phosphor-react';
import { Dispatch, SetStateAction, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IntraData } from '../../Interfaces/interfaces';
import { getStoredData } from '../../utils/utils';

interface DropzoneProps {
  onFileUploaded: (file: File) => void;
  setIntraData: Dispatch<SetStateAction<IntraData>>;
}

export function Dropzone({ onFileUploaded, setIntraData }: DropzoneProps) {
  const onDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acceptedFiles: any) => {
      const localStore: string | null = window.localStorage.getItem('userData');
      if (localStore) {
        const data: IntraData = JSON.parse(localStore);
        const file = new File([acceptedFiles[0]], `${data.login}_avatar.jpg`);
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
      <NotePencil size={120} className="dropzone__button"></NotePencil>
    </div>
  );
}
