import { Alien, Envelope, Image, Password, User } from 'phosphor-react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { isValidInput } from '../../../others/utils/utils';
import { ButtonCustom } from '../../ButtonCustom/ButtonCustom';
import { Dropzone } from '../../Dropzone/Dropzone';
import { TextInput } from '../../TextInput/TextInput';
import './SignUpForm.scss';

interface SignUpFormProps {
  setSignInWithoutIntra: (arg0: boolean) => void;
  setCreateAccount: (arg0: boolean) => void;
  setLoading: (arg0: boolean) => void;
}

interface CreateUser {
  first_name: string;
  usual_full_name: string;
  email: string;
  nick: string;
  imgUrl: string;
  token: string;
  matches: string;
  wins: string;
  lose: string;
  isIntra: boolean;
  password: string;
}

export interface InputError {
  invalid: boolean;
  errorMsg: string;
}

const defaultInputError: InputError = {
  errorMsg: '',
  invalid: false
};


export function SignUpForm({ setSignInWithoutIntra, setCreateAccount, setLoading }: SignUpFormProps) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedFileUrl, setSelectedFileUrl] = useState('/userDefault.12345678.png');
  const [fullName, setFullName] = useState('');
  const [errorName, setErrorName] = useState<InputError>(defaultInputError);
  const [nick, setNick] = useState('');
  const [errorNick, setErrorNick] = useState<InputError>(defaultInputError);
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState<InputError>(defaultInputError);
  const [password, setPassword] = useState('');
  const [errorPassword, setErrorPassword] = useState<InputError>(defaultInputError);
  const { api } = useContext(GlobalContext);
  const navigate = useNavigate();

  function handleKeyEnter(event: any) {
    setLoading(true);
    event.preventDefault();
    handleSubmit();
    setLoading(false);
  }

  async function handleSubmit() {

    if (!isValidInput(fullName, 2, 200)) {
      setErrorName({ errorMsg: 'Invalid name!', invalid: true });
      setFullName('');
      return;
    }
    if (!isValidInput(nick, 2, 50)) {
      setErrorNick({ errorMsg: 'Invalid nick!', invalid: true });
      setNick('');
      return;
    }
    if (!isValidInput(email, 5, 200)) {
      setErrorEmail({ errorMsg: 'Invalid email!', invalid: true });
      setEmail('');
      return;
    }
    if (!isValidInput(password, 6, 50)) {
      setErrorPassword({ errorMsg: 'Password must have at least 6 character!', invalid: true });
      setPassword('');
      return;
    }

    const createUser: CreateUser = {
      email: email,
      first_name: fullName,
      usual_full_name: fullName,
      nick: nick,
      imgUrl: selectedFile ? selectedFile.name : 'userDefault.12345678.png',
      lose: '0',
      matches: '0',
      token: 'aaa',
      wins: '0',
      isIntra: false,
      password: password
    };

    let config;
    try {
      const response = await api.post('/auth/createUser', createUser);
      window.localStorage.setItem('token', response.data.access_token);
      config = {
        headers: {
          Authorization: `Bearer ${response.data.access_token}`
        }
      };
      navigate('/');
      const data = new FormData();
      data.append('name', 'createUserImage');
      if (selectedFile) {
        data.append('file', selectedFile);
        await api.post('/user/uploadImage', data, config);
      }
    } catch (err: any) {
      if (err.response.status === 403) {
        if (err.response.data.message === 'Nick already registered!') {
          setErrorNick({ errorMsg: 'Nick already registered!', invalid: true });
          setNick('');
        } else if (err.response.data.message === 'Email already registered!') {
          setErrorEmail({ errorMsg: 'Email already registered!', invalid: true });
          setEmail('');
        }
      }
    }




  }

  function handleOnChange(e: any, setValue: any, inputError: InputError, setInputError: any) {
    setValue(e.target.value);
    if (inputError != defaultInputError) {
      setInputError(defaultInputError);
    }
  }


  return (
    <>
      <form className='signin__form' onSubmit={handleKeyEnter}>
        <div className='signin__form__image'>
          {
            selectedFileUrl ?
              <img src={selectedFileUrl} className='signin__form__image__icon' alt='Image Preview' /> :
              <Image className='signin__form__image__icon' size={150} />
          }
          <div className='signin__form__button_text'>
            <Dropzone setSelectedFileUrl={setSelectedFileUrl} onFileUploaded={setSelectedFile} />
          </div>
        </div>
        <TextInput.Root>
          <TextInput.Icon >
            <User />
          </TextInput.Icon>
          <TextInput.Input
            inputerror={errorName} value={fullName}
            onChange={(e) => handleOnChange(e, setFullName, errorName, setErrorName)} myclassname='siginin__form__input' placeholder='Full name' />
        </TextInput.Root>

        <TextInput.Root>
          <TextInput.Icon >
            <Alien />
          </TextInput.Icon>
          <TextInput.Input
            inputerror={errorNick} value={nick}
            onChange={(e) => handleOnChange(e, setNick, errorNick, setErrorNick)} myclassname='siginin__form__input' placeholder='Nick name' />
        </TextInput.Root>

        <TextInput.Root>
          <TextInput.Icon >
            <Envelope />
          </TextInput.Icon>
          <TextInput.Input
            inputerror={errorEmail} value={email}
            onChange={(e) => handleOnChange(e, setEmail, errorEmail, setErrorEmail)} myclassname='siginin__form__input' placeholder='E-mail' type='email' />
        </TextInput.Root>

        <TextInput.Root>
          <TextInput.Icon >
            <Password />
          </TextInput.Icon>
          <TextInput.Input
            inputerror={errorPassword} value={password}
            onChange={(e) => handleOnChange(e, setPassword, errorPassword, setErrorPassword)} myclassname='siginin__form__input' placeholder='Password' type='password' />
        </TextInput.Root>

        <ButtonCustom.Root>
          <ButtonCustom.Button msg='Create' myclassname='signin__form__button' />
        </ButtonCustom.Root>
      </form>
      <footer>
        <span onClick={() => { setSignInWithoutIntra(true); setCreateAccount(false); }} className='signin__sigin'>Already have an account? SignIn!</span>
      </footer>
    </>
  );
}