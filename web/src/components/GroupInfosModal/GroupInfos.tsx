import { useQuery } from 'react-query';
import { useContext} from 'react';
import { IntraDataContext } from '../../contexts/IntraDataContext';
import './GroupInfos.scss';
import { CardAdmin } from './CardAdmin';
import { CardMember } from './CardMember';

interface GroupInfosProps {
  id: string | undefined;
}

export function GroupInfos({ id }: GroupInfosProps) {
  const { api, config } = useContext(IntraDataContext);
  const { data, status } = useQuery(
    'getGroupInfos',
    async () => {
      const response = await api.patch('/chat/getGroupInfosById', { id: id }, config);
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: true,
    }
  );

  if (status === 'loading')
    return <div className='groupInfos' />;

  return (
    <div className='groupInfos'>

      <div className='groupInfos__infos'>
        <div className='groupInfos__infos__image'>
          <img src={data.image} alt="Group Image" />
        </div>
        <span>{data.name}</span>
        <span>{data.owner.name}</span>
      </div >

      <div className='groupInfos__members'>
        < div className='groupInfos__members__body'>
          {
            data.admins &&
            data.admins.map((obj: any) => <CardAdmin key={crypto.randomUUID()} member={obj} />)
          }
          {
            data.members &&
            data.members.map((obj: any) => <CardMember key={crypto.randomUUID()} id={data.id} member={obj} />)
          }
        </div>
      </div>
    </div >
  );
}