import { Envelope, Password } from 'phosphor-react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { isValidInput } from '../../../others/utils/utils';
import { ButtonCustom } from '../../ButtonCustom/ButtonCustom';
import { TextInput } from '../../TextInput/TextInput';
import './SignInForm.scss';


interface SignInFormProps {
  setCreateAccount: (arg0: boolean) => void;
  setSignInWithoutIntra: (arg0: boolean) => void;
  setForgotPassword: (arg0: boolean) => void;
  setLoading: (arg0: boolean) => void;
}

export function SignInForm({ setForgotPassword, setCreateAccount, setSignInWithoutIntra, setLoading }: SignInFormProps) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Incorrect e-mail or password!');
  const { api } = useContext(GlobalContext);
  const navigate = useNavigate();



  function handleKeyEnter(event: any) {
    setLoading(true);
    event.preventDefault();
    handleSubmit();
    setLoading(false);
  }

  async function handleSubmit() {
    const response = await api.get('/test');
    console.log(response, 'opa');

    const credentials = {
      email: email,
      password: password,
    };
    if (!isValidInput(email, 5) && !isValidInput(password, 6)) {
      setError(true);
      setEmail('');
      setPassword('');
      return;
    }

    try {
      const response = await api.post('/auth/signInWithoutIntra', credentials);
      window.localStorage.setItem('token', response.data.access_token);
      navigate('/');

    } catch (err: any) {
      setError(true);
      setEmail('');
      setPassword('');
      if (err.response.status === 500) {
        setErrorMsg('Internal server error!');
      }
    }
  }

  return (
    <>
      <form className='signin__form' onSubmit={handleKeyEnter}>
        <TextInput.Root>
          <TextInput.Icon>
            <Envelope />
          </TextInput.Icon>
          <TextInput.Input value={email} onChange={(e) => setEmail(e.target.value)} myclassname='siginin__form__input' placeholder='E-mail' />
        </TextInput.Root>

        <TextInput.Root>
          <TextInput.Icon>
            <Password />
          </TextInput.Icon>
          <TextInput.Input value={password} onChange={(e) => setPassword(e.target.value)} myclassname='siginin__form__input' placeholder='Password' type='password' />
        </TextInput.Root>

        {error &&
          <span className='signin__error'>{errorMsg}</span>
        }

        <ButtonCustom.Root>
          <ButtonCustom.Button msg='SignIn' myclassname='signin__form__button' />
        </ButtonCustom.Root>
      </form>
      <footer className='signin__footer'>
        <span onClick={() => { setCreateAccount(true); setSignInWithoutIntra(false); }} className='signin__createAccount'>Dont have an account? Create one now!</span>
        <span onClick={() => { setForgotPassword(true); setSignInWithoutIntra(false); }} className='signin__createAccount'>Forgot Password?</span>
      </footer>
    </>
  );
}