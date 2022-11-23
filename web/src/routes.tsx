import './main.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import NotFound from './pages/NotFound/NotFound';
import OAuth from './pages/OAuth/OAuth';
import Profile from './pages/Profile/Profile';
import Game from './pages/Game/Game';
import Chat from './pages/Chat/Chat';
import { NavBar } from './components/NavBar/NavBar';
import { RequireAuth, ValidadeSignin } from './others/utils/utils';
import { IntraDataProvider } from './contexts/IntraDataContext';
import { ChatProvider } from './contexts/ChatContext';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';
import { state } from './adapters/game/gameState';



export default function AppRouter() {

  useEffect(() => {
    window.onpopstate = () => {
      if (state.socket || state.game) {
        window.location.reload();
      }
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <IntraDataProvider>
                <RequireAuth>
                  <NavBar Children={Home} />
                </RequireAuth>
              </IntraDataProvider>
            }
          />
          <Route
            path="/profile"
            element={
              <IntraDataProvider>
                <RequireAuth>
                  <NavBar Children={Profile} />
                </RequireAuth>
              </IntraDataProvider>
            }
          />
          <Route
            path="/game"
            element={
              <IntraDataProvider>
                <RequireAuth>
                  <Game />
                </RequireAuth>
              </IntraDataProvider>
            }
          />
          <Route
            path="/chat"
            element={
              <IntraDataProvider>
                <RequireAuth>
                  <ChatProvider>
                    <NavBar Children={Chat} />
                  </ChatProvider>
                </RequireAuth>
              </IntraDataProvider>
            }
          />
          <Route path="/oauth" element={<OAuth />} />
          <Route
            path="/signin"
            element={
              <ValidadeSignin >
                <SignIn />
              </ValidadeSignin>
            } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router >
  );
}
