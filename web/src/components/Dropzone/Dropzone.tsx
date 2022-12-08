import { NotePencil } from 'phosphor-react';
import { Dispatch, SetStateAction, useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { GlobalContext } from '../../contexts/GlobalContext';

interface DropzoneProps {
  setSelectedFileUrl?: Dispatch<SetStateAction<string>> | null;
  onFileUploaded: (file: File) => void;
}

export function Dropzone({ setSelectedFileUrl, onFileUploaded }: DropzoneProps) {
  const { intraData } = useContext(GlobalContext);

  const onDrop = useCallback(
    (acceptedFiles: any) => {

      function generateCode(length: number) {
        let code = '';
        const availableChar = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < length; i++) {
          code += availableChar.charAt(Math.floor(Math.random() * availableChar.length));
        }
        return code;
      }
      const id = generateCode(24);
      const hash = generateCode(8);
      const file = new File([acceptedFiles[0]], `${id}.${hash}.jpg`);
      const fileUrl = URL.createObjectURL(file);
      if (setSelectedFileUrl)
        setSelectedFileUrl(fileUrl);
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
      <NotePencil size={120} className='dropzone__button' />
    </div>
  );
}
