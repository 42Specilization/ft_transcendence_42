import './HistoricMatch.scss';

interface HistoricMatchProps {
  nick: string;
  date: string;
  result: string;
  image_url: string;
}

export function HistoricMatch({nick, date, result, image_url} :HistoricMatchProps){
  return (
    <div className='historicMatch'>
      <div className='historicMatch__player'>
        <div className='historicMatch__player__icon'>
          <img src={image_url} alt="user image" />
        </div>
        <div className='historicMatch__player__nick'>
          {nick}
        </div>
      </div>
      <div className='historicMatch__datas'>
        <div className='historicMatch__date'>{date}</div>
        <div className='historicMatch__result'>{result}</div>
      </div>
    </div>
  );
}
