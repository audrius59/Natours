/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const result = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${type === 'data' ? 'updateMe' : 'updatePassword'}`,
      data
    });
    if (result.data.status === 'success') {
      showAlert(
        'success',
        `${type === 'data' ? 'Data' : 'Password'} updated successfully`
      );
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};
