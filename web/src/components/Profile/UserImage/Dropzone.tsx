import { NotePencil } from 'phosphor-react';
import { useCallback, useContext } from 'react';
import { useDropzone } from 'react-dropzone';
import { IntraDataContext } from '../../../contexts/IntraDataContext';


interface DropzoneProps {
  onFileUploaded: (file: File) => void;
}

export function Dropzone({ onFileUploaded }: DropzoneProps) {

  const { intraData } = useContext(IntraDataContext);

  const onDrop = useCallback(
    (acceptedFiles: any) => {

      function generateCode() {
        let code = '';
        const avaliableChar = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < 24; i++) {
          code += avaliableChar.charAt(Math.floor(Math.random() * avaliableChar.length));
        }
        return code;
      }
      const id = generateCode();
      const file = new File([acceptedFiles[0]], `${id}.jpg`);
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
