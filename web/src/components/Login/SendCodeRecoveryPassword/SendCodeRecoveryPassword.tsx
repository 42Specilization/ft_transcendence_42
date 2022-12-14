import { Code } from 'phosphor-react';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { isValidInput } from '../../../others/utils/utils';
import { ButtonCustom } from '../../ButtonCustom/ButtonCustom';
import { TextInput } from '../../TextInput/TextInput';
import './SendCodeRecoveryPassword.scss';


interface SendCodeRecoveryPasswordProps {
  email: string;
  setChangePassword: (arg0: boolean) => void;
  setSendCode: (arg0: boolean) => void;
}

export function SendCodeRecoveryPassword({ email, setChangePassword, setSendCode }: SendCodeRecoveryPasswordProps) {

  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Invalid code!');
  const { api } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);

  function handleKeyEnter(event: any) {
    event.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    handleSubmit();
  }

  async function handleSubmit() {
    if (!isValidInput(code, 6)) {
      setError(true);
      setCode('');
      setLoading(false);
      return;
    }

    try {
      setError(false);
      await api.post('/auth/validateRecoveryPasswordCode', { code, email });
      setChangePassword(true);
      setSendCode(false);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(true);
      setCode('');
      if (err.response.status === 500) {
        setErrorMsg('Internal server error!');
      } else {
        setErrorMsg(err.response.data.message);
      }
    }
  }

  return (
    <form className='SendCodeRecoveryPassword' onSubmit={handleKeyEnter}>
      <TextInput.Root>
        <TextInput.Icon>
          <Code />
        </TextInput.Icon>
        <TextInput.Input value={code} onChange={(e) => setCode(e.target.value)} placeholder='Recovery password code' myclassname='SendCodeRecoveryPassword__input' />
      </TextInput.Root>

      {error &&
        <span className='SendCodeRecoveryPassword__errors'>{errorMsg}</span>
      }
      <ButtonCustom.Root>
        <ButtonCustom.Button msg='Submit code' myclassname='SendCodeRecoveryPassword__button' />
      </ButtonCustom.Root>
    </form>
  );
}