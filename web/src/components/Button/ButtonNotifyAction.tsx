import './Button.scss';
import { Check, X } from 'phosphor-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

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
      <button
        id='notifyAction_button'
        className='button__icon'
        onClick={handleAction}
        data-tooltip-content={type}
      >
        {type === 'Accept' ?
          <Check size={32} /> :
          <X size={32} />
        }
        <Tooltip anchorId='notifyAction_button' delayShow={50} />
      </button>
    </>
  );
}