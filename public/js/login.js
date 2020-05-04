/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const result = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    if (result.data.status === 'success') {
      window.setTimeout(() => {
        showAlert('success', 'Logged in successfully');
        location.assign('/');
      }, 1500);
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};

export const logout = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if (response.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Error occured during logging out, Try again later!');
  }
};
