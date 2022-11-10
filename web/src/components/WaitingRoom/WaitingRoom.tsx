/* eslint-disable indent */
import { useEffect } from 'react';
import './WaitingRoom.scss';

export function WaitingRoom() {
  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);
  }, []);

  function handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'q':
      case 'Q':
      case 'Escape':
        window.location.reload();
        break;
    }
  }

  return (
    <div className='waiting-room'>
      <h1>Waiting for another player!</h1>
    </div>
  );
}
