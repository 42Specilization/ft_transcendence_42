import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import './ButtonCustom.scss';

export interface ButtonCustomRootProps {
  children: ReactNode;
  myclassname?: string;
}

function ButtonCustomRoot({ children, myclassname }: ButtonCustomRootProps) {
  return (
    <div className={`buttonCustom__root ${myclassname}`} >
      {children}
    </div>
  );
}

ButtonCustomRoot.displayName = 'ButtonCustom.Root';

export interface ButtonCustomIconProps {
  children: ReactNode;
  myclassname?: string;
}

function ButtonCustomIcon({ children, myclassname }: ButtonCustomIconProps) {
  return (
    <Slot className={`buttonCustom__icon ${myclassname}`}>
      {children}
    </Slot>
  );
}

ButtonCustomIcon.displayName = 'ButtonCustomIcon';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ButtonCustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  msg: string;
  myclassname?: string;
}

function ButtonCustomButton(props: ButtonCustomButtonProps) {
  return (
    <button
      {...props}
      className={`buttonCustom__button ${props.myclassname}`}
    > {props.msg} </button>
  );
}

ButtonCustomButton.displayName = 'ButtonCustom.Input';

export const ButtonCustom = {
  Root: ButtonCustomRoot,
  Button: ButtonCustomButton,
  Icon: ButtonCustomIcon
};
