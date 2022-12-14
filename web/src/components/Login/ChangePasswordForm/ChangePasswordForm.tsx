import { Password } from 'phosphor-react';
import { useContext, useState } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { isValidInput } from '../../../others/utils/utils';
import { ButtonCustom } from '../../ButtonCustom/ButtonCustom';
import { Loader } from '../../Game/Loader/Loader';
import { TextInput } from '../../TextInput/TextInput';
import './ChangePasswordForm.scss';

interface ChangePasswordFormProps {
  email: string;
}

export function ChangePasswordForm({ email }: ChangePasswordFormProps) {

  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Password is to weak!');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
    if (!isValidInput(password, 6)) {
      setError(true);
      setPassword('');
      setConfirmPassword('');
      setErrorMsg('Password is to weak!');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError(true);
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
      setErrorMsg('Both password must be equals!');
      return;
    }


    try {
      setError(false);
      await api.post('/auth/changePassword', { email, password, confirmPassword });
      setLoading(false);
      setSuccess(true);
    } catch (err: any) {
      setLoading(false);
      setError(true);
      setPassword('');
      setConfirmPassword('');
      if (err.response.status === 500) {
        setErrorMsg('Internal server error!');
      } else {
        setErrorMsg(err.response.data.message);
      }
    }
  }

  return (
    <form className='changePasswordForm' onSubmit={handleKeyEnter}>
      <TextInput.Root>
        <TextInput.Icon>
          <Password />
        </TextInput.Icon>
        <TextInput.Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' myclassname='changePasswordForm__input' type='password' />
      </TextInput.Root>

      <TextInput.Root>
        <TextInput.Icon>
          <Password />
        </TextInput.Icon>
        <TextInput.Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='confirm password' myclassname='changePasswordForm__input' type='password' />
      </TextInput.Root>

      {error &&
        <span className='changePasswordForm__errors'>{errorMsg}</span>
      }
      {loading &&
        <Loader />}
      <ButtonCustom.Root>
        <ButtonCustom.Button msg='Change password' myclassname='changePasswordForm__button' />
      </ButtonCustom.Root>
      {success &&
        <div className='changePasswordForm__success' onClick={() => window.location.reload()}>
          <span>Successfully changed password</span>
          <span>Back to login!</span>
        </div>
      }
    </form >
  );
}