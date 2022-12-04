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
import { UserData } from '../../../others/Interfaces/interfaces';

interface CardMemberProps {
  data: any;
  bannedVisible: boolean;
  havePermission: (arg0: string) => boolean;
}

export function CardMember({ data, bannedVisible, havePermission }: CardMemberProps) {

  function heightMenu() {
    if (havePermission('maxLevel'))
      return 190;
    if (havePermission('middleLevel'))
      return 145;
    return 55;
  }

  return (
    <div className='group__profile__card__member'>
      {(data.members && !bannedVisible) && data.members.map((obj: UserData) => {
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
              {havePermission('maxLevel') &&
                <>
                  <ButtonRemoveAdmin id={data.id} name={obj.login} />
                  {obj.mutated ?
                    <ButtonUnMuteMember id={data.id} name={obj.login} /> :
                    <ButtonMuteMember id={data.id} name={obj.login} />
                  }
                  <ButtonKickMember id={data.id} name={obj.login} />
                  <ButtonBanMember id={data.id} name={obj.login} />
                </>
              }
            </CardUser>
          );
        else
          return (
            <CardUser key={Math.random()} user={obj} menuHeight={heightMenu()}>
              <div />
              {havePermission('middleLevel') &&
                <>
                  {havePermission('maxLevel') &&
                    <ButtonMakeAdmin id={data.id} name={obj.login} />
                  }
                  {obj.mutated ?
                    <ButtonUnMuteMember id={data.id} name={obj.login} /> :
                    <ButtonMuteMember id={data.id} name={obj.login} />
                  }
                  <ButtonKickMember id={data.id} name={obj.login} />
                  <ButtonBanMember id={data.id} name={obj.login} />
                </>
              }
            </CardUser>
          );
      })}
      {(data.banned && bannedVisible) && data.banned.map((obj: UserData) =>
        <CardUser key={Math.random()} user={obj} menuHeight={55}>
          <div></div>
          <ButtonUnBanMember id={data.id} name={obj.login} />
        </CardUser>
      )}
    </div>
  );
}
