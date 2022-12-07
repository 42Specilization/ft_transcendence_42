import './Button.scss';
import { DotsThreeVertical } from 'phosphor-react';
import { Dispatch, SetStateAction } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

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
        data-tooltip-content={'Menu'}
      />
      <Tooltip anchorId='button__menu' delayShow={50} />
    </>
  );
}