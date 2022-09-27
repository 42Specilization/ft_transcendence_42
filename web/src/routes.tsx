import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import SignIn from './pages/SignIn/SignIn';
import './main.css';
import OAuth from './pages/OAuth/OAuth';
import useAuth from './auth/auth';
import { AuthProvider } from './auth/auth';

function RequireAuth({ children }: any) {
  const { auth } = useAuth();
  return auth === true ? children : <Navigate to='/signin' replace />;
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
          <Route path='/oauth' element={<OAuth />} />
          <Route path='/signin' element={<SignIn />} />
        </Routes>
      </AuthProvider>
    </Router>
  );

}