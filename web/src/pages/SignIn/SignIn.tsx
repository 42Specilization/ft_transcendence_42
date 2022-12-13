import { Alien, CaretRight, Envelope, IdentificationCard, Image, Password, User } from 'phosphor-react';
import pongGame from '../../assets/pong-game.png';
import logo42 from './42_logo.svg';
import { ButtonCustom } from '../../components/ButtonCustom/ButtonCustom';
import './SignIn.scss';
import { useState } from 'react';
import { TextInput } from '../../components/TextInput/TextInput';
import { Dropzone } from '../../components/Dropzone/Dropzone';

export default function SignIn() {

  const [selectedFile, setSelectedFile] = useState<File>();
  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  const [signInWithoutIntra, setSignInWithoutIntra] = useState<boolean>(false);

  return (
    <div >
      <div className='signin'>
        <div className='signin__logo'>
        </div>
        {(() => {
          if (!signInWithoutIntra) {
            return (
              <div className='signin__options'>
                <a href={import.meta.env.VITE_REDIRECT_LOGIN_URL}>
                  <ButtonCustom.Root myClassName='signin__button__root'>
                    <ButtonCustom.Button msg='SignIn' myClassName='signin__button' />
                    <ButtonCustom.Icon myClassName='signin__button__icon'>
                      <img src={logo42} alt='42 logo' />
                    </ButtonCustom.Icon>
                  </ButtonCustom.Root>
                </a>
                <ButtonCustom.Root myClassName='signin__button__root'>
                  <ButtonCustom.Button onClick={() => setSignInWithoutIntra(true)} msg='SignIn without intra' myClassName='signin__button' />
                  <ButtonCustom.Icon myClassName='signin__button__icon'>
                    <IdentificationCard size={32} />
                  </ButtonCustom.Icon>
                </ButtonCustom.Root>
              </div>
            );
          } else {
            return (
              <form className='signin__form'>
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
                  <TextInput.Input myClassName='siginin__form__input' placeholder='Full fame' />
                  <TextInput.Icon >
                    <User />
                  </TextInput.Icon>
                </TextInput.Root>

                <TextInput.Root>
                  <TextInput.Input myClassName='siginin__form__input' placeholder='Nick' />
                  <TextInput.Icon >
                    <Alien />
                  </TextInput.Icon>
                </TextInput.Root>

                <TextInput.Root>
                  <TextInput.Input myClassName='siginin__form__input' placeholder='E-mail' type='email' />
                  <TextInput.Icon >
                    <Envelope />
                  </TextInput.Icon>
                </TextInput.Root>

                <TextInput.Root>
                  <TextInput.Input myClassName='siginin__form__input' placeholder='Password' type='password' />
                  <TextInput.Icon >
                    <Password />
                  </TextInput.Icon>
                </TextInput.Root>

                <ButtonCustom.Root>
                  <ButtonCustom.Button onClick={() => setSignInWithoutIntra(false)} msg='Create' myClassName='signin__form__button' />
                </ButtonCustom.Root>
              </form>
            );
          }
        })()

        }
      </div>

    </div >
  );
}