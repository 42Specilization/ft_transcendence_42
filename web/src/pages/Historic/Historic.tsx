import { useEffect, useState } from "react";
import { HistoricMatch } from "../../components/HistoricMatch/HistoricMatch";
import { IntraData } from "../../Interfaces/interfaces";
import { defaultIntra, getStoredData } from "../../utils/utils";
import "./Historic.scss";

export default function Historic() {
  const [intraData, setIntraData] = useState<IntraData>(defaultIntra);
  useEffect(() => {
    getStoredData(setIntraData);
  }, []);

  return (
    <div className="body">
      <div className="historic">
        <div className="historic__header">
          <div className="historic__header__title">
            <p>Historic</p>
          </div>
          <div className="historic__columns">
            <p>Player</p>
            <p>Date</p>
            <p>Result</p>
          </div>
        </div>
        <div className="historic__body">
          {[1, 2, 3, 4, 3, 3, 3, 3, 3].map(() => (
            <>
              <HistoricMatch
                image_url={intraData.image_url}
                nick={intraData.login}
                date="12/12/22"
                result="win/lose 10X1"
              />
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
