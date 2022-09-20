import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import  Home  from './pages/Home/Home';
import  SignIn  from './pages/SignIn/SignIn';
import './main.css';

export default function AppRouter() {

  return (
    <Router>
      <Routes>
        <Route path='/home' element={<Home />}/>
        <Route path='/signin' element={<SignIn />}/>
      </Routes>
    </Router>
  );

}