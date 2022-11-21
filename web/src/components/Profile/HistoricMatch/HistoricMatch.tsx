import { ReactElement } from 'react';
import './HistoricMatch.scss';

interface HistoricMatchProps {
  nick: string;
  date: string;
  result: string;
  image_url: string;
}

export function HistoricMatch({
  nick,
  date,
  result,
  image_url,
}: HistoricMatchProps) {
  
  function formatDate(date: string): ReactElement {
    const newDate = new Date(date);
    return (
      <>
        {String(newDate.getDate()).padStart(2, '0') +
          '/' +
          String(newDate.getMonth() + 1).padStart(2, '0') +
          '/' +
          newDate.getFullYear()}
        <br />
        {String(newDate.getHours()).padStart(2, '0') +
            ':' +
            String(newDate.getMinutes()).padStart(2, '0')}{' '}
      </>
    );
  }

  return (
    <div className='historicMatch'>
      <div className='historicMatch__player'>
        <img src={image_url} alt='user image' />
        <div className='historicMatch__player__nick'>{nick}</div>
      </div>
      <p className='historicMatch__infos'>{formatDate(date)}</p>
      <p className='historicMatch__infos'>{result}</p>
    </div >
  );
}
