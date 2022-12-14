import { Envelope } from 'phosphor-react';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { isValidInput } from '../../../others/utils/utils';
import { ButtonCustom } from '../../ButtonCustom/ButtonCustom';
import { Loader } from '../../Game/Loader/Loader';
import { TextInput } from '../../TextInput/TextInput';
import { ChangePasswordForm } from '../ChangePasswordForm/ChangePasswordForm';
import { SendCodeRecoveryPassword } from '../SendCodeRecoveryPassword/SendCodeRecoveryPassword';
import './ForgotPasswordForm.scss';

interface ForgotPasswordFormProps {
  setForgotPassword: (arg0: boolean) => void;
  setSignInWithoutIntra: (arg0: boolean) => void;
}

export function ForgotPasswordForm({ setForgotPassword, setSignInWithoutIntra }: ForgotPasswordFormProps) {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Invalid email!');
  const [email, setEmail] = useState('');
  const [sendCode, setSendCode] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { api } = useContext(GlobalContext);

  function handleKeyEnter(event: any) {
    event.preventDefault();
    if (loading) {
      return;
    }
    setLoading(true);
    handleSubmit();
  }

  async function handleSubmit() {
    if (!isValidInput(email, 5)) {
      setError(true);
      setEmail('');
      setLoading(false);
      return;
    }

    try {
      setError(false);
      await api.post('/auth/passwordRecoverySendEmail', { email });
      setLoading(false);
      setSendCode(true);
    } catch (err: any) {
      setError(true);
      setLoading(false);
      setEmail('');
      if (err.response.status === 500) {
        setErrorMsg('Internal server error!');
      } else {
        setErrorMsg(err.response.data.message);
      }
    }
  }

  return (
    <div>
      {(() => {
        if (!sendCode && !changePassword) {
          return (
            <>
              <form className='forgotPasswordForm' onSubmit={handleKeyEnter}>
                <TextInput.Root>
                  <TextInput.Icon>
                    <Envelope />
                  </TextInput.Icon>
                  <TextInput.Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Your Pong Game Email' myclassname='forgotPasswordForm__form__input' />
                </TextInput.Root>

                {error &&
                  <span className='forgotPasswordForm__errors'>{errorMsg}</span>
                }
                {loading &&
                  <Loader />}
                <ButtonCustom.Root>
                  <ButtonCustom.Button msg='Reset Password' myclassname='forgotPasswordForm__form__button' />
                </ButtonCustom.Root>
              </form>
              <footer className='forgotPasswordForm__footer'>
                <span onClick={() => { setForgotPassword(false); setSignInWithoutIntra(true); }} className='forgotPasswordForm__goBack'>Remembered?</span>
              </footer>
            </>
          );
        } else if (sendCode) {
          return (
            <SendCodeRecoveryPassword email={email} setChangePassword={setChangePassword} setSendCode={setSendCode} />
          );
        } else if (changePassword) {
          return (
            <ChangePasswordForm email={email} />
          );
        }
      })()

      }
    </div >
  );
}


