import { NotePencil } from 'phosphor-react';
import { useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { IntraDataContext } from '../../contexts/IntraDataContext';

interface DropzoneProps {
  onFileUploaded: (file: File) => void;
}

export function Dropzone({ onFileUploaded }: DropzoneProps) {

  const { intraData, setUpdateImageTime } = useContext(IntraDataContext);

  const onDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acceptedFiles: any) => {
      const file = new File([acceptedFiles[0]], `${intraData.login}_avatar.jpg`);
      const data = Math.floor(Math.random() * 1000);
      setUpdateImageTime(data);
      onFileUploaded(file);
    },
    [onFileUploaded, intraData]
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
      <input {...getInputProps()} accept='image/*' />
      <NotePencil size={120} className='dropzone__button'></NotePencil>
    </div>
  );
}
