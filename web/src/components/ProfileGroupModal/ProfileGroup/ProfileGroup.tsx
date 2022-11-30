import './ProfileGroup.scss';
import { useQuery } from 'react-query';
import { useContext } from 'react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';
import { CardAdmin } from '../CardAdmin/CardAdmin';
import { CardMember } from '../CardMember/CardMember';

interface ProfileGroupProps {
  id: string | undefined;
}

export function ProfileGroup({ id }: ProfileGroupProps) {
  const { api, config } = useContext(IntraDataContext);
  const { data, status } = useQuery(
    'getProfileGroup',
    async () => {
      const response = await api.patch('/chat/getProfileGroupById', { id: id }, config);
      return response.data;
    },
    {
      retry: false,
      refetchOnWindowFocus: true,
    }
  );

  if (status === 'loading')
    return <div className='profileGroup' />;

  return (
    <div className='profileGroup'>

      <div className='profileGroup__infos'>
        <div className='profileGroup__infos__image'>
          <img src={data.image} alt="Group Image" />
        </div>
        <span>{data.name}</span>
        <span>Owner: {data.owner.name}</span>
      </div >

      <div className='profileGroup__members'>
        < div className='profileGroup__members__body'>
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