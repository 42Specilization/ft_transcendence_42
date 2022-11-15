import './FriendHistoricMatch.scss';

interface FriendHistoricMatchProps {
  nick: string;
  date: string;
  result: string;
  image_url: string;
}

export function FriendHistoricMatch({
  nick,
  date,
  result,
  image_url,
}: FriendHistoricMatchProps) {
  return (
    <div className='friendHistoricMatch'>
      <div className='friendHistoricMatch__player'>
        <img src={`/public/${image_url}`} alt='user image' />
        <div className='friendHistoricMatch__player__nick'>{nick}</div>
      </div>
      <p className='friendHistoricMatch__infos'>{date}</p>
      <p className='friendHistoricMatch__infos'>{result}</p>
    </div >
  );
}
