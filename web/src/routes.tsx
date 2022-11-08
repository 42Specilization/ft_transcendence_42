/* eslint-disable quotes */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import NotFound from "./pages/NotFound/NotFound";
import OAuth, { getInfos } from "./pages/OAuth/OAuth";
import { AuthProvider } from "./auth/auth";
import "./main.css";
import Profile from "./pages/Profile/Profile";
import Game from "./pages/Game/Game";
import Historic from "./pages/Historic/Historic";
import { ValidateTfa } from "./components/ValidateTfa/ValidateTfa";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IntraData } from "./Interfaces/interfaces";
import { NavBar } from "./components/NavBar/NavBar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RequireAuth({ children }: any) {
  const token = window.localStorage.getItem("token");
  const [isTfaValid, setIsTfaValid] = useState(false);
  /**
   * It checks if the user has TFA enabled, if not, it sets the isTfaValid state to true. If the user has
   * TFA enabled, it checks if the user has validated TFA, if not, it sets the isTfaValid state to false.
   * If the user has TFA enabled and has validated TFA, it sets the isTfaValid state to true
   * @returns a boolean value.
   */
  async function validateTFA() {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const api = axios.create({
      baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
    });

    const user = await api.get("/user/me", config);
    if (
      user.data.isTFAEnable !== undefined &&
      user.data.isTFAEnable === false
    ) {
      setIsTfaValid(true);
      return;
    }
    if (user.data.isTFAEnable && user.data.tfaValidated !== true) {
      setIsTfaValid(false);
      return;
    }
    setIsTfaValid(true);
  }

  validateTFA();
  if (isTfaValid === false) {
    return (
      <div>
        <ValidateTfa />
      </div>
    );
  }

  return token ? children : <Navigate to="/signin" replace />;
}

export async function getStoredData(
  setIntraData: Dispatch<SetStateAction<IntraData>>
) {
  let localStore = window.localStorage.getItem("userData");
  if (!localStore) {
    await getInfos();
    localStore = window.localStorage.getItem("userData");
    if (!localStore) return;
  }
  const data: IntraData = JSON.parse(localStore);
  setIntraData(data);
}

export const defaultIntra: IntraData = {
  email: "ft_transcendence@gmail.com",
  first_name: "ft",
  image_url: "nop",
  login: "PingPong",
  usual_full_name: "ft_transcendence",
  matches: "0",
  wins: "0",
  lose: "0",
  isTFAEnable: false,
  tfaValidated: false,
};

export default function AppRouter() {
  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);

  useEffect(() => {
    getStoredData(setIntraData);
  }, []);

  console.log(intraData);
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <NavBar name={intraData.login} imgUrl={intraData.image_url} />
                <Home />
              </RequireAuth>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <NavBar name={intraData.login} imgUrl={intraData.image_url} />
                <Profile />
              </RequireAuth>
            }
          />

          <Route
            path="/historic"
            element={
              <RequireAuth>
                <NavBar name={intraData.login} imgUrl={intraData.image_url} />
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
