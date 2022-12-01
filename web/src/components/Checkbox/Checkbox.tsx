import './Checkbox.scss';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CheckboxProps extends CheckboxPrimitive.CheckboxProps {}

export function Checkbox(props: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root {...props} className='checkbox'>
      <CheckboxPrimitive.Indicator asChild>
        <Check weight='bold' className='checkbox__icon' />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}