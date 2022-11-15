import './FriendCard.scss';

interface FriendCardProps {
  friendData: {
    name: string,
    login: string,
    image_url: string,
  };
}

export function FriendCard({friendData}: FriendCardProps) {

  console.log('image', friendData.image_url);
  let image_url = friendData.image_url;
  if (!friendData.image_url.includes('https://cdn.intra.42.fr/'))
    image_url = `/public/${image_url}`;
  return (
    <div className='friendCard'>
      <img className='friendCard_image' src={image_url} alt='friend_image' />
      <strong className='friendCard__infos'>{friendData.name}</strong>
      <div className='friendCard__infos__nick'>
        <strong>{friendData.login}</strong>
      </div>
    </div >
  );
}
