import './FriendCard.scss';

interface FriendCardProps {
  friendData: {
    name: string,
    login: string,
    image_url: string,
  };
}

export function FriendCard({friendData}: FriendCardProps) {

 
  return (
    <div className='friendCard'>
      <img className='friendCard_image' src={friendData.image_url} alt='friend_image' />
      <strong className='friendCard__infos'>{friendData.name}</strong>
      <div className='friendCard__infos__nick'>
        <strong>{friendData.login}</strong>
      </div>
    </div >
  );
}
