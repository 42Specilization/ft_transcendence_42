import './ValidateTfa.scss';
import { useEffect, useState, useContext } from 'react';
import { Modal } from '../../Modal/Modal';
import { TailSpin } from 'react-loader-spinner';
import { GlobalContext } from '../../../contexts/GlobalContext';

export function ValidateTfa() {
  const [side, setSide] = useState('');
  const [code, setCode] = useState('');
  const [placeHolder, setPlaceHolder] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {api, config} = useContext(GlobalContext);

  useEffect(() => {
    setTimeout(() => {
      setSide('sendCode');
    }, 1000);
  }, []);

  async function turnOnTFA(body: any, config: any) {
    const updateTfa = await api.patch('/user/turn-on-tfa', body, config);
    if (updateTfa.status === 200) {
      setSide('');
    }
  }

  async function sendEmail() {
    const user = await api.get('/user/me', config);
    const body = {
      isTFAEnable: true,
      tfaEmail: user.data.tfaEmail,
      tfaValidated: false,
    };
    setIsLoading(true);
    await api.patch('/user/validate-email', body, config);
    setIsLoading(false);
    setSide('validateCode');
  }

  async function handleValidateCode() {
    const body = {
      tfaCode: code,
      tfaValidated: false,
    };
    try {
      const validateCode = await api.patch('/user/validate-code', body, config);
      if (validateCode.status === 200) {
        body.tfaValidated = true;
        turnOnTFA(body, config);
        window.location.reload();
      }
    } catch (err) {
      setPlaceHolder('Invalid Code');
    }
    setCode('');
  }

  function handleKeyEnter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleValidateCode();
  }

  return (
    <div className="validateTfa" style={{ display: side === '' ? 'none' : '' }}>
      <Modal>
        <div className='validateTfa__sendCode'
          style={{ display: side === 'sendCode' ? '' : 'none' }}>
          <h3 className='validateTfa__title'>Click to request a new code</h3>
          <button className='validateTfa__button__sendCode'
            onClick={sendEmail}>
            Send Code
          </button>
          <div className='validateTfa__loading'>
            <div className='validateTfa__loading__div'
              style={{ display: isLoading ? '' : 'none' }}>
              <strong>Wait a moment</strong>
              <TailSpin width='25' height='25' color='white' ariaLabel='loading' />
            </div>
          </div>
        </div>
        <div className='validateTfa__verify__code'
          style={{ display: side === 'validateCode' ? '' : 'none' }}>
          <form className='validateTfa__form' onSubmit={handleKeyEnter}>
            <h3 className='validateTfa__title'>Insert received code</h3>
            <input
              className='validateTfa__form__input'
              value={code}
              placeholder={placeHolder}
              style={{ border: placeHolder !== '' ? '3px solid red' : 'none' }}
              onChange={(code) => {
                setCode(code.target.value);
                setPlaceHolder('');
              }}
              ref={e => e?.focus()}
            />
            <button className='validateTfa__button__validate'>
              Validate
            </button>
          </form>
          <button onClick={sendEmail}>
            Dont receive? Click to request again
          </button>
          <div className='validateTfa__loading'>
            <div className='validateTfa__loading__div'
              style={{ display: isLoading ? '' : 'none' }}>
              <strong>Wait a moment</strong>
              <TailSpin width='25' height='25' color='white' ariaLabel='loading' />
            </div>
          </div>
        </div>
      </Modal>
    </div >
  );
}
