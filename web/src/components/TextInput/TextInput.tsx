import { InputHTMLAttributes, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import './TextInput.scss';
import { InputError } from '../Login/SignUpForm/SignUpForm';

export interface TextInputRootProps {
  children: ReactNode;
}

function TextInputRoot({ children }: TextInputRootProps) {
  return (
    <div className='textInput__root'>
      {children}
    </div>
  );
}

TextInputRoot.displayName = 'TextInput.Root';

export interface TextInputIconProps {
  children: ReactNode;
}

function TextInputIcon({ children }: TextInputIconProps) {
  return (
    <Slot className='textInput__icon'>
      {children}
    </Slot>
  );
}

TextInputIcon.displayName = 'TextInputIcon';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextInputInputProps extends InputHTMLAttributes<HTMLInputElement> {
  myclassname?: string;
  inputerror?: InputError;
}

function TextInputInput(props: TextInputInputProps) {
  return (
    <input
      {...props}
      className={`textInput__input ${props.myclassname}`}
      style={{ border: props.inputerror?.invalid ? '3px solid red' : 'none' }}
      placeholder={props.inputerror?.invalid ? props.inputerror?.errorMsg : props.placeholder}
    />
  );
}

TextInputInput.displayName = 'TextInput.Input';

export const TextInput = {
  Root: TextInputRoot,
  Input: TextInputInput,
  Icon: TextInputIcon
};
