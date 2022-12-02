import './main.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import NotFound from './pages/NotFound/NotFound';
import OAuth from './pages/OAuth/OAuth';
import Profile from './pages/Profile/Profile';
import Game from './pages/Game/Game';
import Chat from './pages/Chat/Chat';
import Community from './pages/Community/Community';
import { NavBar } from './components/NavBar/NavBar';
import { RequireAuth, ValidateSignin } from './others/utils/utils';
import { IntraDataProvider } from './contexts/IntraDataContext';
import { ChatProvider } from './contexts/ChatContext';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';
import { state } from './adapters/game/gameState';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function AppRouter() {
  const queryClient = new QueryClient();
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
        <QueryClientProvider client={queryClient}>
          <ChatProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <IntraDataProvider>
                      <NavBar Children={Home} />
                    </IntraDataProvider>
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth>
                    <IntraDataProvider>
                      <NavBar Children={Profile} />
                    </IntraDataProvider>
                  </RequireAuth>
                }
              />
              <Route
                path="/game"
                element={
                  <RequireAuth>
                    <IntraDataProvider>
                      <Game />
                    </IntraDataProvider>
                  </RequireAuth>
                }
              />
              <Route
                path="/chat"
                element={
                  <RequireAuth>
                    <IntraDataProvider>
                      <NavBar Children={Chat} />
                    </IntraDataProvider>
                  </RequireAuth>
                }
              />
              <Route
                path="/community"
                element={
                  <RequireAuth>
                    <IntraDataProvider>
                      <NavBar Children={Community} />
                    </IntraDataProvider>
                  </RequireAuth>
                }
              />
              <Route path="/oauth" element={<OAuth />} />
              <Route
                path="/signin"
                element={
                  <ValidateSignin >
                    <SignIn />
                  </ValidateSignin>
                } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ChatProvider>
        </QueryClientProvider>
      </AuthProvider >
    </Router >
  );
}
