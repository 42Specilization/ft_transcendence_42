import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import NotFound from './pages/NotFound/NotFound';
import OAuth from './pages/OAuth/OAuth';
import { AuthProvider } from './auth/auth';
import './main.css';
import Profile from './pages/Profile/Profile';
import ProfileUpdateNick from './pages/ProfileUpdateNick/ProfileUpdateNick';
import Game from './pages/Game/Game';
import Historic from './pages/Historic/Historic';
import ValidateTfa from './pages/ValidateTfa/ValidateTfa';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RequireAuth({ children }: any) {
  const token = window.localStorage.getItem('token');
  const tfaValidate = window.localStorage.getItem('tfaValidate');
  if (tfaValidate == 'false'){
    return (
      <div>
        <ValidateTfa/>
      </div>
    );
  }
  return (token ? children : <Navigate to='/signin' replace />);
}

export default function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          } />

          <Route path='/profile' element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          } />

          <Route path='/game' element={
            <RequireAuth>
              <Game />
            </RequireAuth>
          } />

          <Route path='/updateNick' element={
            <RequireAuth>
              <ProfileUpdateNick />
            </RequireAuth>
          } />

          <Route path='/historic' element={
            <RequireAuth>
              <Historic />
            </RequireAuth>
          } />
          <Route path='/oauth' element={<OAuth />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router >
  );

}
