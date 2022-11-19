import './TFAButton.scss';
import { useContext, useEffect, useState } from 'react';
import { TFATurnOffModal } from '../TFATurnOffModal/TFATurnOffModal';
import { TFATurnOnModal } from '../TFATurnOnModal/TFATurnOnModal';
import { TFAValidateCodeModal } from '../TFAValidateCodeModal/TFAValidateCodeModal';
import { ToggleLeft, ToggleRight } from 'phosphor-react';
import { IntraDataContext } from '../../../contexts/IntraDataContext';

export function TFAButton() {
  const { api, config } = useContext(IntraDataContext);
  const [tfaEmail, setTfaEmail] = useState('');
  const [tfaModal, setTfaModal] = useState('');

  const [tfaEnable, setTfaEnable] = useState<boolean>(false);
  async function checkTfa() {
    const user = await api.get('/user/me', config);
    if (user.data.isTFAEnable)
      setTfaEnable(true);
    else
      setTfaEnable(false);
  }

  useEffect(() => {
    checkTfa();
  }, []);

  return (
    <div className='tfaButton'>
      <strong>2FA Authentication</strong>
      <button className='tfaButton__button'
        style={{ backgroundColor: tfaEnable ? 'green' : 'red' }}
        onClick={() => {
          if (tfaEnable)
            setTfaModal('TFATurnOff');
          else
            setTfaModal('TFATurnOn');
        }}>
        {tfaEnable ? <ToggleRight size={50} /> : <ToggleLeft size={50} />}
      </button>
      {(() => {
        if (tfaModal === 'TFATurnOn')
          return <TFATurnOnModal
            tfaEmail={tfaEmail}
            setTfaEmail={setTfaEmail}
            setTfaModal={setTfaModal} />;
        if (tfaModal === 'TFAValidate')
          return <TFAValidateCodeModal
            tfaEmail={tfaEmail}
            setTfaEmail={setTfaEmail}
            setTfaModal={setTfaModal}
            setTfaEnable={setTfaEnable} />;
        if (tfaModal === 'TFATurnOff')
          return <TFATurnOffModal
            setTfaModal={setTfaModal}
            setTfaEnable={setTfaEnable} />;
      })()}
    </div>
  );
}
