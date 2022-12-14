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
import { GlobalProvider } from './contexts/GlobalContext';
import { ChatProvider } from './contexts/ChatContext';
import { AuthProvider } from './contexts/AuthContext';
import { useEffect } from 'react';
import { stateGame } from './adapters/game/gameState';
import { QueryClient, QueryClientProvider } from 'react-query';

export default function AppRouter() {
  const queryClient = new QueryClient();
  useEffect(() => {
    window.onpopstate = () => {
      if (stateGame.socket || stateGame.game) {
        window.location.reload();
      }
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <ChatProvider>
                    <GlobalProvider>
                      <NavBar Children={Home} />
                    </GlobalProvider>
                  </ChatProvider>
                </RequireAuth>
              }
            />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <ChatProvider>
                    <GlobalProvider>
                      <NavBar Children={Profile} />
                    </GlobalProvider>
                  </ChatProvider>
                </RequireAuth>
              }
            />
            <Route
              path="/game"
              element={
                <RequireAuth>
                  <ChatProvider>
                    <GlobalProvider>
                      <Game />
                    </GlobalProvider>
                  </ChatProvider>
                </RequireAuth>
              }
            />
            <Route
              path="/chat"
              element={
                <RequireAuth>
                  <ChatProvider>
                    <GlobalProvider>
                      <NavBar Children={Chat} />
                    </GlobalProvider>
                  </ChatProvider>
                </RequireAuth>
              }
            />
            <Route
              path="/community"
              element={
                <RequireAuth>
                  <ChatProvider>
                    <GlobalProvider>
                      <NavBar Children={Community} />
                    </GlobalProvider>
                  </ChatProvider>
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
        </QueryClientProvider>
      </AuthProvider >
    </Router >
  );
}
