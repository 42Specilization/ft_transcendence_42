import './UserImage.scss';
import { Link } from 'react-router-dom';
import { Dropzone } from '../Dropzone/Dropzone';
import { useState } from 'react';

interface UserImageProps {
  image_url: string;
  login:string;
}

export function UserImage ({ image_url, login }:UserImageProps) {
  const [selectedFile, setSelectedFile] = useState<File>();


  const data = new FormData();
  data.append('name', login+'profile');
  if (selectedFile){
    data.append('image', selectedFile);
  }
  
  return (
    <div  className="userImage__image">
      <img
        src={image_url} alt="User Image"
      />
      <div className="userImage__button_text">
        {/* <Link
          className='userImage__button_text'
          to='/profile/updateImage'
        > */}
        <Dropzone onFileUploaded={setSelectedFile}></Dropzone>
        {/* </Link> */}
      </div>
    </div>
  );
}
