import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import './ButtonCustom.scss';

export interface ButtonCustomRootProps {
  children: ReactNode;
}

function ButtonCustomRoot({ children }: ButtonCustomRootProps) {
  return (
    <div className='buttonCustom__root'>
      {children}
    </div>
  );
}

ButtonCustomRoot.displayName = 'ButtonCustom.Root';

export interface ButtonCustomIconProps {
  children: ReactNode;
}

function ButtonCustomIcon({ children }: ButtonCustomIconProps) {
  return (
    <Slot className='buttonCustom__icon'>
      {children}
    </Slot>
  );
}

ButtonCustomIcon.displayName = 'ButtonCustomIcon';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ButtonCustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  msg: string;
}

function ButtonCustomButton(props: ButtonCustomButtonProps) {
  return (
    <button
      {...props}
      className='buttonCustom__button'
    > {props.msg} </button>
  );
}

ButtonCustomButton.displayName = 'ButtonCustom.Input';

export const ButtonCustom = {
  Root: ButtonCustomRoot,
  Button: ButtonCustomButton,
  Icon: ButtonCustomIcon
};
