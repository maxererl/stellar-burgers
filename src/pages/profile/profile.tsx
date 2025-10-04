import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUser,
  updateUser,
  getUpdateRequest,
  getAuthError,
  clearError
} from '../../services/authSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const updateRequest = useSelector(getUpdateRequest);
  const error = useSelector(getAuthError) || undefined;

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isFormChanged) {
      return;
    }

    // Basic validation
    if (!formValue.name.trim()) {
      return; // Name is required
    }

    if (!formValue.email.trim()) {
      return; // Email is required
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formValue.email)) {
      return; // Invalid email format
    }

    // Password validation (if provided)
    if (formValue.password && formValue.password.length < 6) {
      return; // Password too short
    }

    // Clear any previous errors
    dispatch(clearError());

    // Prepare update data - only include changed fields
    const updateData: { name?: string; email?: string; password?: string } = {};

    if (formValue.name !== user?.name) {
      updateData.name = formValue.name.trim();
    }

    if (formValue.email !== user?.email) {
      updateData.email = formValue.email.trim();
    }

    if (formValue.password) {
      updateData.password = formValue.password;
    }

    // Only make API call if there are actual changes
    if (Object.keys(updateData).length > 0) {
      dispatch(updateUser(updateData)).then((result) => {
        if (updateUser.fulfilled.match(result)) {
          // Clear password field after successful update
          setFormValue((prev) => ({ ...prev, password: '' }));
        }
      });
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    // Clear any errors when canceling
    dispatch(clearError());
    // Reset form to original user data
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={error}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
