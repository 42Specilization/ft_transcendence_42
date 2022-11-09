import './HistoricMatch.scss';

interface HistoricMatchProps {
  nick: string;
  date: string;
  result: string;
  image_url: string;
}

export default function HistoricMatch({
  nick,
  date,
  result,
  image_url,
}: HistoricMatchProps) {
  return (
    <div className="historicMatch">
      <div className="historicMatch__player">
        <img src={image_url} alt="user image" />
        <div className="historicMatch__player__nick">{nick}</div>
      </div>
      <p className="historicMatch__infos">{date}</p>
      <p className="historicMatch__infos">{result}</p>
    </div >
  );
}
