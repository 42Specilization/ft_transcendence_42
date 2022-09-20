import './styles/main.css';
import { SigIn } from './pages/SigIn'
import { Home } from './pages/Home'
import { useRef, useState } from 'react';

function App() {

  const [sigInVar, setSigInVar] = useState<boolean>(false)

  return (
    <div>
      {sigInVar ? <Home /> : <SigIn sigIn={setSigInVar} />}
    </div>
  )
}

export default App
