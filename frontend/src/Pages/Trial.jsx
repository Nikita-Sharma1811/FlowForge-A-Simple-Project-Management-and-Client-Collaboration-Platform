import React from 'react';
import { useDispatch } from 'react-redux';
import { login,register,getUserProfile, getUserOrganisation, getMyOrganisation } from '../store/auth/authSlice';

const Trial = () => {
  const dispatch = useDispatch();
  const handleLogin = () => {
    dispatch(login({ password: 'string', email: 'john@example.com' }));
  };

  const handleRegister = () => {
    dispatch(register({ password: 'string', email: 'abc@example.com', userName: 'Deepak Sharma' }));
  };
    const handleMyProfile = () => {
    dispatch(getUserProfile());
  };

    const handleMyOrganisation = () => {
    dispatch(getMyOrganisation());
  };

 const handleUserOrganisation = () => {
  const userId = "6901db1674347ab0092e5a69"; // Get user ID from state or context
  if (userId) {
    dispatch(getUserOrganisation({ userId }));
  }
};

  return (
    <div>
      <button onClick={handleLogin} className='border-md'>Login</button>
     <button onClick={handleRegister}>Register</button>
     <button onClick={handleMyProfile}>myProfile</button>
     <button onClick={handleMyOrganisation}>myOrganisation</button>
        <button onClick={handleUserOrganisation}>userOrganisation</button>
    </div>
  );
};

export default Trial;
