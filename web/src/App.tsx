import './styles/main.css';
import pongGame from './assets/pong-game.png'

function App() {

  return (
    <div className='max-w-[1344px] mx-auto my-20 flex flex-col items-center'>
      {/* <h1 className='text-9xl font-extrabold text-white text-shadow-style my-28'>Pong Game</h1> */}
      <img src={pongGame} alt='title' className='my-28' />
      <button className='text-5xl text-white bg-violet-500 px-4 py-3 h-32 w-[600px] rounded-[100px] font-bold border-4 border-white hover:bg-violet-600'>Sign in</button>
    </div>
  )
}

export default App
