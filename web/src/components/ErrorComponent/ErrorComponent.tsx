import { WarningCircle } from 'phosphor-react';
import './ErrorComponent.scss';

export default function ErrorComponent ({ defaultError }){

  if (!defaultError)
    return <span></span>;
  return (
    <div className='errorComponent'>
      <WarningCircle className="errorComponent__warning" size={32} />
      <span className='errorComponent__text'> {defaultError} </span>
    </div>
  );
}
