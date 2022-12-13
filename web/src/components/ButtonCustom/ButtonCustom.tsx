import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import './ButtonCustom.scss';

export interface ButtonCustomRootProps {
  children: ReactNode;
  myClassName?: string;
}

function ButtonCustomRoot({ children, myClassName }: ButtonCustomRootProps) {
  return (
    <div className={`buttonCustom__root ${myClassName}`} >
      {children}
    </div>
  );
}

ButtonCustomRoot.displayName = 'ButtonCustom.Root';

export interface ButtonCustomIconProps {
  children: ReactNode;
  myClassName?: string;
}

function ButtonCustomIcon({ children, myClassName }: ButtonCustomIconProps) {
  return (
    <Slot className={`buttonCustom__icon ${myClassName}`}>
      {children}
    </Slot>
  );
}

ButtonCustomIcon.displayName = 'ButtonCustomIcon';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ButtonCustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  msg: string;
  myClassName?: string;
}

function ButtonCustomButton(props: ButtonCustomButtonProps) {
  return (
    <button
      {...props}
      className={`buttonCustom__button ${props.myClassName}`}
    > {props.msg} </button>
  );
}

ButtonCustomButton.displayName = 'ButtonCustom.Input';

export const ButtonCustom = {
  Root: ButtonCustomRoot,
  Button: ButtonCustomButton,
  Icon: ButtonCustomIcon
};
