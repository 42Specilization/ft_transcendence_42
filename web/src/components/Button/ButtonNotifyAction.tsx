import './Button.scss';
import { Check, X } from 'phosphor-react';

interface ButtonNotifyActionProps {
  type: string;
  handle: ((...args: any[]) => void);
  params: any[];
}

export function ButtonNotifyAction({ type, handle, params }: ButtonNotifyActionProps) {

  function handleAction() {
    handle(...params);
  }

  return (
    <>
      <button className='button__icon'
        onClick={handleAction}
        data-html={true}
        data-tooltip-content={type}
      >
        {type === 'Accept' ?
          <Check size={32} /> :
          <X size={32} />
        }
      </button>
    </>
  );
}