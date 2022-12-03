import './CardMember.scss';
import { ButtonUnBanMember } from '../../Button/ButtonUnBanMember';
import { Alien, Crown } from 'phosphor-react';
import { CardUser } from '../../CardUser/CardUser';
import { ButtonRemoveAdmin } from '../../Button/ButtonRemoveAdmin';
import { ButtonUnMuteMember } from '../../Button/ButtonUnMuteMember';
import { ButtonMuteMember } from '../../Button/ButtonMuteMember';
import { ButtonKickMember } from '../../Button/ButtonKickMember';
import { ButtonBanMember } from '../../Button/ButtonBanMember';
import { ButtonMakeAdmin } from '../../Button/ButtonMakeAdmin';

interface CardMemberProps {
  data: any;
  bannedVisible: boolean;
  getPermission: (arg0: string) => boolean;
}

export function CardMember({ data, bannedVisible, getPermission }: CardMemberProps) {

  function heightMenu() {
    if (getPermission('maxLevel'))
      return 190;
    if (getPermission('middleLevel'))
      return 145;
    return 55;
  }

  return (
    <div className='group__profile__card__member'>
      {(data.members && !bannedVisible) && data.members.map((obj: any) => {
        if (obj.role === 'owner')
          return (
            <CardUser key={Math.random()} user={obj} menuHeight={0}>
              <Crown id='card__owner' size={32} />
            </CardUser>
          );
        if (obj.role === 'admin')
          return (
            <CardUser key={Math.random()} user={obj} menuHeight={heightMenu()}>
              <Alien id='card__admin' size={32} />
              {getPermission('maxLevel') &&
                <>
                  <ButtonRemoveAdmin id={data.id} name={obj.name} />
                  {obj.mutated ?
                    <ButtonUnMuteMember id={data.id} name={obj.name} /> :
                    <ButtonMuteMember id={data.id} name={obj.name} />
                  }
                  <ButtonKickMember id={data.id} name={obj.name} />
                  <ButtonBanMember id={data.id} name={obj.name} />
                </>
              }
            </CardUser>
          );
        else
          return (
            <CardUser key={Math.random()} user={obj} menuHeight={heightMenu()}>
              <div />
              {getPermission('middleLevel') &&
                <>
                  {getPermission('maxLevel') &&
                    <ButtonMakeAdmin id={data.id} name={obj.name} />
                  }
                  {obj.mutated ?
                    <ButtonUnMuteMember id={data.id} name={obj.name} /> :
                    <ButtonMuteMember id={data.id} name={obj.name} />
                  }
                  <ButtonKickMember id={data.id} name={obj.name} />
                  <ButtonBanMember id={data.id} name={obj.name} />
                </>
              }
            </CardUser>
          );
      })}
      {(data.banned && bannedVisible) && data.banned.map((obj: any) =>
        <CardUser key={Math.random()} user={obj} menuHeight={55}>
          <div></div>
          <ButtonUnBanMember id={data.id} name={obj.name} />
        </CardUser>
      )}
    </div>
  );
}
