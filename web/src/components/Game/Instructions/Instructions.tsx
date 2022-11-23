import './Instructions.scss';

export function Instructions() {
  return (
    <div className='gameMenu__Instructions'>
      <h2>Instructions</h2>
      <ul className='gameMenu__Instructions__list'>
        <li>Try not to change the focus of the page during a match, or you may get disconnected.</li>
        <li>If a bug happens, try restarting the page or even logging in again.</li>
      </ul>
    </div>
  );
}