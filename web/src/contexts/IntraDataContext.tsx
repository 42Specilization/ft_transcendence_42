import { Dispatch, SetStateAction, createContext, useState, ReactNode, useEffect } from 'react';
import { IntraData } from '../Interfaces/interfaces';
import { actionsStatus } from '../status/statusState';
import { defaultIntra, getIntraData } from '../utils/utils';

interface IIntraDataContext {
  intraData: IntraData;
  setIntraData: Dispatch<SetStateAction<IntraData>>;
  updateImageTime: number;
  setUpdateImageTime: Dispatch<SetStateAction<number>>;
}

export const IntraDataContext = createContext<IIntraDataContext>({
  intraData: defaultIntra,
  setIntraData: () => {},
  updateImageTime: Date.now(),
  setUpdateImageTime: () => {},
});

interface IntraDataProvider {
  children: ReactNode;
}

export const IntraDataProvider = ({ children }: IntraDataProvider) => {

  const [intraData, setIntraData] = useState(defaultIntra);
  const [updateImageTime, setUpdateImageTime] = useState(Date.now());

  useEffect(() => {
    getIntraData(setIntraData);
    actionsStatus.initializeSocketStatus(setIntraData);
  }, []);

  return (
    <IntraDataContext.Provider value={{ intraData, setIntraData, updateImageTime, setUpdateImageTime }}>
      { children }
    </IntraDataContext.Provider>
  );
};