import './UserImage.scss';
import { useContext, useEffect, useState } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { actionsStatus } from '../../../adapters/status/statusState';
import { Dropzone } from '../../Dropzone/Dropzone';
import { getUrlImage } from '../../../others/utils/utils';

export function UserImage() {

  const { api, config, intraData } = useContext(IntraDataContext);
  const [selectedFile, setSelectedFile] = useState<File>();

  async function handleSubmit() {
    const data = new FormData();
    data.append('name', intraData.login);
    if (selectedFile) {
      data.append('file', selectedFile);
    }
    await api.post('/user/updateImage', data, config);
    actionsStatus.changeImage(selectedFile?.name);
  }

  useEffect(() => {
    if (selectedFile) handleSubmit();
  }, [selectedFile]);

  return (
    <div className='userImage__image'>
      <img src={`${getUrlImage(intraData.image_url)}`} alt='User Image' />
      <div className='userImage__button_text'>
        <Dropzone onFileUploaded={setSelectedFile} />
      </div>
    </div>
  );
}
