import './Button.scss';
import { DotsThreeVertical } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';
import ReactTooltip from 'react-tooltip';

interface ButtonMenuProps {
  setActiveMenu: Dispatch<SetStateAction<boolean>>;
}

export function ButtonMenu({ setActiveMenu }: ButtonMenuProps) {
  return (
    <>
      <DotsThreeVertical
        id='button__menu'
        size={40}
        onClick={() => setActiveMenu(prev => !prev)}
        data-tip={'Menu'}
      />
      <ReactTooltip delayShow={50} />
    </>
  );
}