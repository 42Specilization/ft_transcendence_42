import { WarningCircle } from 'phosphor-react';
import './ErrorComponent.scss';
interface ErrorComponentProps {
  defaultError : string;
}

export function ErrorComponent ({ defaultError }:ErrorComponentProps){

  if (!defaultError)
    return <span></span>;
  return (
    <div className='errorComponent'>
      <WarningCircle className="errorComponent__warning" size={32} />
      <span className='errorComponent__text'> {defaultError} </span>
    </div>
  );
}
