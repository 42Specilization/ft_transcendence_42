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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIntraData: () => { },
  updateImageTime: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUpdateImageTime: () => { },
});

interface IntraDataProviderProps {
  children: ReactNode;
}

export const IntraDataProvider = ({ children }: IntraDataProviderProps) => {

  const [intraData, setIntraData] = useState(defaultIntra);
  const [updateImageTime, setUpdateImageTime] = useState(Math.floor(Math.random() * 1000));

  useEffect(() => {
    getIntraData(setIntraData);
    actionsStatus.initializeSocketStatus(setIntraData);
  }, []);

  return (
    <IntraDataContext.Provider value={{ intraData, setIntraData, updateImageTime, setUpdateImageTime }}>
      {children}
    </IntraDataContext.Provider>
  );
};