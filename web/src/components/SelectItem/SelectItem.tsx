import './SelectItem.scss';
import * as SelectPrimitive from '@radix-ui/react-select';
import { CaretDown,Check } from 'phosphor-react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SelectProps extends SelectPrimitive.SelectProps {

}

export function SelectItem(props: SelectProps) {
  return (
    <SelectPrimitive.Root {...props} >
      <SelectPrimitive.Trigger className="SelectTrigger" >
        <SelectPrimitive.Value placeholder='Select a type' />
        <SelectPrimitive.Icon className="SelectIcon">
          <CaretDown />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="SelectContent">



          <SelectPrimitive.Viewport className="SelectViewport">

            <SelectPrimitive.Item className='SelectItem' value='public'>
              <SelectPrimitive.ItemText>public</SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator className="SelectItemIndicator" asChild >
                <Check />
              </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>

            <SelectPrimitive.Item className='SelectItem' value='protected'>
              <SelectPrimitive.ItemText>protected</SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator className="SelectItemIndicator" asChild >
                <Check />
              </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>

            <SelectPrimitive.Item className='SelectItem' value='private'>
              <SelectPrimitive.ItemText>private</SelectPrimitive.ItemText>
              <SelectPrimitive.ItemIndicator className="SelectItemIndicator" asChild >
                <Check />
              </SelectPrimitive.ItemIndicator>
            </SelectPrimitive.Item>

          </SelectPrimitive.Viewport>

        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}