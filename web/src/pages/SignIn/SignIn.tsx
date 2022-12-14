import { IdentificationCard } from 'phosphor-react';
import logo42 from './42_logo.svg';
import { ButtonCustom } from '../../components/ButtonCustom/ButtonCustom';
import './SignIn.scss';
import { useState } from 'react';
import { SignUpForm } from '../../components/Login/SignUpForm/SignUpForm';
import { SignInForm } from '../../components/Login/SignInForm/SignInForm';
import { DoubleBubble } from '../../components/DoubleBubble/DoubleBubble';

export default function SignIn() {

  const [signInWithoutIntra, setSignInWithoutIntra] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div >
      <div className='signin'>
        <div className='signin__logo'>
        </div>
        {(() => {
          if (!signInWithoutIntra && !createAccount) {
            return (
              <div className='signin__options'>
                <ButtonCustom.Root myclassname='signin__button__root'>
                  <ButtonCustom.Button onClick={() => setSignInWithoutIntra(true)} msg='Login' myclassname='signin__button' />
                  <ButtonCustom.Icon myclassname='signin__button__icon'>
                    <IdentificationCard size={32} />
                  </ButtonCustom.Icon>
                </ButtonCustom.Root>
                <a href={import.meta.env.VITE_REDIRECT_LOGIN_URL}>
                  <ButtonCustom.Root myclassname='signin__button__root'>
                    <ButtonCustom.Button msg='Login Intra' myclassname='signin__button' />
                    <ButtonCustom.Icon myclassname='signin__button__icon'>
                      <img src={logo42} alt='42 logo' />
                    </ButtonCustom.Icon>
                  </ButtonCustom.Root>
                </a>
              </div>
            );
          } else if (loading) {
            return (
              <DoubleBubble customText='loading...' speed={5} />
            );
          }
          else if (!createAccount) {
            return (
              <SignInForm setLoading={setLoading} setCreateAccount={setCreateAccount} setSignInWithoutIntra={setSignInWithoutIntra} />
            );
          } else {
            return (
              <SignUpForm setLoading={setLoading} setSignInWithoutIntra={setSignInWithoutIntra} setCreateAccount={setCreateAccount} />
            );
          }
        })()

        }
      </div>

    </div >
  );
}