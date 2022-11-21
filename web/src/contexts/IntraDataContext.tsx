import axios, { AxiosInstance } from 'axios';
import { Dispatch, SetStateAction, createContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { IntraData } from '../others/Interfaces/interfaces';
import { actionsStatus } from '../adapters/status/statusState';
import { defaultIntra, getIntraData } from '../others/utils/utils';

interface IIntraDataContext {
  intraData: IntraData;
  setIntraData: Dispatch<SetStateAction<IntraData>>;
  updateImageTime: number;
  setUpdateImageTime: Dispatch<SetStateAction<number>>;
  config: {
    headers: {
      Authorization: string
    }
  },
  api: AxiosInstance
}

export const IntraDataContext = createContext<IIntraDataContext>({
  intraData: defaultIntra,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIntraData: () => { },
  updateImageTime: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUpdateImageTime: () => { },
  config: {
    headers: {
      Authorization: ''
    }
  },
  api: axios.create({
    baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
  })
});



interface IntraDataProviderProps {
  children: ReactNode;
}

export const IntraDataProvider = ({ children }: IntraDataProviderProps) => {

  const [intraData, setIntraData] = useState(defaultIntra);
  const [updateImageTime, setUpdateImageTime] = useState(Math.floor(Math.random() * 1000));

  const config = useMemo(() => {
    return {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      },
    };
  }, []);

  const api = useMemo(() => axios.create({
    baseURL: `http://${import.meta.env.VITE_API_HOST}:3000`,
  }), []);


  useEffect(() => {
    getIntraData(setIntraData);
    actionsStatus.initializeSocketStatus(setIntraData);
    return;
  }, []);

  return (
    <IntraDataContext.Provider value={{ intraData, setIntraData, updateImageTime, setUpdateImageTime, api, config }}>
      {children}
    </IntraDataContext.Provider>
  );
};