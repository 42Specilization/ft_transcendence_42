import './UserImage.scss';
import { Link } from 'react-router-dom';

interface UserImageProps {
  image_url: string;
}

export function UserImage ({ image_url }:UserImageProps) {
  return (
    <div  className="userImage__image">
      <img
        src={image_url} alt="User Image"
      />
      <div className="userImage__button">
        <Link
          className='userImage__button_text'
          to='/updateImage'
        >
          Change image
        </Link>
      </div>
    </div>
  );
}
