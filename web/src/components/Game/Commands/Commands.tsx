import './Commands.scss';

export function Commands() {
  return (
    <div className='gameMenu__commands'>
      <h2>Commands</h2>
      <ul className='gameMenu__commands__list'>
        <li>[W] or [ArrowUp] - move to up.</li>
        <li>[S] or [ArrowDown] - move to down.</li>
        <li>[ESC] - Exit the game.</li>
      </ul>
    </div>
  );
}