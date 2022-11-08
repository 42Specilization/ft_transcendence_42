
import "./Profile.scss";
import { useEffect, useState } from "react";
import { IntraData } from "../../Interfaces/interfaces";
import React from "react";
import { ProfileCard } from "../../components/ProfileCard/ProfileCard";
import { defaultIntra, getStoredData } from "../../utils/utils";

export default function Profile() {
  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);

  useEffect(() => {
    window.localStorage.removeItem("userData");
    getStoredData(setIntraData);
  }, []);

  return (
    <div className="body">
      <div className="profile">
        <ProfileCard
          email={intraData.email}
          image_url={intraData.image_url}
          login={intraData.login}
          full_name={intraData.usual_full_name}
          setIntraData={setIntraData}
        />

        <div className="profile__stats">
          <div className="profile__stats__title">
            <p>Stats</p>
          </div>
          <div className="profile__stats__infos">
            <p>Matches:</p>
            <p>{intraData.matches}</p>
          </div>
          <div className="profile__stats__infos">
            <p>Wins:</p>
            <p>{intraData.wins}</p>
          </div>
          <div className="profile__stats__infos">
            <p>Lose:</p>
            <p>{intraData.lose}</p>
          </div>
          <div className="profile__stats__infos">
            <p>Ratio W/L:</p>
            <p>
              {(
                Number(intraData.wins) /
                (Number(intraData.lose) > 0 ? Number(intraData.lose) : 1)
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
