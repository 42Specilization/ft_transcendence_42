import './main.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import NotFound from './pages/NotFound/NotFound';
import OAuth from './pages/OAuth/OAuth';
import { AuthProvider } from './auth/auth';
import Profile from './pages/Profile/Profile';
import Game from './pages/Game/Game';
import Historic from './pages/Historic/Historic';
import { NavBar } from './components/NavBar/NavBar';
import { RequireAuth } from './utils/utils';

export default function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <NavBar/>
                <Home />
              </RequireAuth>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <NavBar/>
                <Profile />
              </RequireAuth>
            }
          />

          <Route
            path="/historic"
            element={
              <RequireAuth>
                <NavBar/>
                <Historic />
              </RequireAuth>
            }
          />
          <Route
            path="/game"
            element={
              <RequireAuth>
                <Game />
              </RequireAuth>
            }
          />

          <Route path="/oauth" element={<OAuth />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
