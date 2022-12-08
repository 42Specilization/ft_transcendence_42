import './Button.scss';
import { Check, X } from 'phosphor-react';
import ReactTooltip from 'react-tooltip';


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
        data-tip={type}
      >
        {type === 'Accept' ?
          <Check size={32} /> :
          <X size={32} />
        }
        <ReactTooltip delayShow={50} />
      </button>
    </>
  );
}