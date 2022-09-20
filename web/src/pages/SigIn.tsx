import { Dispatch, SetStateAction } from 'react';
import pongGame from '../assets/pong-game.png';

interface SigIn {
  sigIn: Dispatch<SetStateAction<boolean>>;
}

export function SigIn({ sigIn }: SigIn) {

  function handleSignIn() {
    console.log(sigIn);
    sigIn(true);
  }

  return (
    <div className='max-w-[1344px] mx-auto my-20 flex flex-col items-center'>
      {/* <h1 className='text-9xl font-extrabold text-white text-shadow-style my-28'>Pong Game</h1> */}
      <img src={pongGame} alt='title' className='my-28' />
      <button
        className='text-5xl text-white bg-violet-500 px-4 py-3 h-32 w-[600px] rounded-[100px] font-bold border-2 border-white hover:bg-violet-600'
        onClick={handleSignIn}
      >
        Sign in
      </button>
    </div>
  );
}