import { FC, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  forgotPassword,
  getForgotPasswordRequest,
  getAuthError
} from '../../services/authSlice';

export const ForgotPassword: FC = () => {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forgotPasswordRequest = useSelector(getForgotPasswordRequest);
  const error = useSelector(getAuthError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    dispatch(forgotPassword({ email })).then((result) => {
      if (forgotPassword.fulfilled.match(result)) {
        localStorage.setItem('resetPassword', 'true');
        navigate('/reset-password', { replace: true });
      }
    });
  };

  return (
    <ForgotPasswordUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
