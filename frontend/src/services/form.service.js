import axios from 'axios';
import authService from './auth.service';

const API_URL = '/api/forms';

// Common axios request configuration
const axiosConfig = {
  timeout: 10000, // 10 seconds timeout
  validateStatus: function (status) {
    // Accept any status code to handle errors gracefully
    return true;
  }
};

class FormService {
  getAllForms() {
    console.log('Getting all forms');
    return axios.get(API_URL, { 
      headers: authService.getAuthHeader(),
      ...axiosConfig
    })
    .then(response => {
      console.log('Get all forms response:', response);
      if (response.status !== 200) {
        console.warn('Get all forms returned non-200 status:', response.status);
        return {
          error: true,
          status: response.status,
          data: [],
          message: response.data && response.data.message 
            ? response.data.message 
            : 'Failed to load forms. Please try again.'
        };
      }
      return response;
    })
    .catch(error => {
      console.error('Error getting all forms:', error);
      return {
        error: true,
        data: [],
        message: 'Failed to load forms. Please try again later.'
      };
    });
  }

  getFormById(id) {
    console.log('Getting form by ID:', id);
    return axios.get(`${API_URL}/${id}`, { 
      headers: authService.getAuthHeader(),
      ...axiosConfig
    })
    .then(response => {
      console.log('Get form by ID response:', response);
      if (response.status !== 200) {
        console.warn('Get form by ID returned non-200 status:', response.status);
        return {
          error: true,
          status: response.status,
          data: null,
          message: response.data && response.data.message 
            ? response.data.message 
            : 'Failed to load form. Please try again.'
        };
      }
      return response;
    })
    .catch(error => {
      console.error('Error getting form by ID:', error);
      return {
        error: true,
        data: null,
        message: 'Failed to load form. Please try again later.'
      };
    });
  }

  getFormByPublicUrl(publicUrl) {
    console.log('Getting form by public URL:', publicUrl);
    return axios.get(`${API_URL}/public/${publicUrl}`, axiosConfig)
    .then(response => {
      console.log('Get form by public URL response:', response);
      if (response.status !== 200) {
        console.warn('Get form by public URL returned non-200 status:', response.status);
        return {
          error: true,
          status: response.status,
          data: null,
          message: response.data && response.data.message 
            ? response.data.message 
            : 'Failed to load form. Please try again.'
        };
      }
      return response;
    })
    .catch(error => {
      console.error('Error getting form by public URL:', error);
      return {
        error: true,
        data: null,
        message: 'Failed to load form. Please try again later.'
      };
    });
  }

  createForm(formData) {
    console.log('Creating form:', formData);
    return axios.post(API_URL, formData, { 
      headers: authService.getAuthHeader(),
      ...axiosConfig
    })
    .then(response => {
      console.log('Create form response:', response);
      if (response.status !== 200) {
        console.warn('Create form returned non-200 status:', response.status);
        return {
          error: true,
          status: response.status,
          data: null,
          message: response.data && response.data.message 
            ? response.data.message 
            : 'Failed to create form. Please try again.'
        };
      }
      return response;
    })
    .catch(error => {
      console.error('Error creating form:', error);
      return {
        error: true,
        data: null,
        message: 'Failed to create form. Please try again later.'
      };
    });
  }

  deleteForm(id) {
    console.log('Deleting form:', id);
    return axios.delete(`${API_URL}/${id}`, { 
      headers: authService.getAuthHeader(),
      ...axiosConfig
    })
    .then(response => {
      console.log('Delete form response:', response);
      if (response.status !== 200) {
        console.warn('Delete form returned non-200 status:', response.status);
        return {
          error: true,
          status: response.status,
          message: response.data && response.data.message 
            ? response.data.message 
            : 'Failed to delete form. Please try again.'
        };
      }
      return response;
    })
    .catch(error => {
      console.error('Error deleting form:', error);
      return {
        error: true,
        message: 'Failed to delete form. Please try again later.'
      };
    });
  }

  getFormResponses(formId) {
    console.log('Getting form responses:', formId);
    return axios.get(`/api/forms/${formId}/responses`, { 
      headers: authService.getAuthHeader(),
      ...axiosConfig
    })
    .then(response => {
      console.log('Get form responses response:', response);
      if (response.status !== 200) {
        console.warn('Get form responses returned non-200 status:', response.status);
        return {
          error: true,
          status: response.status,
          data: [],
          message: response.data && response.data.message 
            ? response.data.message 
            : 'Failed to load responses. Please try again.'
        };
      }
      return response;
    })
    .catch(error => {
      console.error('Error getting form responses:', error);
      return {
        error: true,
        data: [],
        message: 'Failed to load responses. Please try again later.'
      };
    });
  }

  getResponseById(responseId) {
    console.log('Getting response by ID:', responseId);
    return axios.get(`/api/responses/${responseId}`, { 
      headers: authService.getAuthHeader(),
      ...axiosConfig
    })
    .then(response => {
      console.log('Get response by ID response:', response);
      if (response.status !== 200) {
        console.warn('Get response by ID returned non-200 status:', response.status);
        return {
          error: true,
          status: response.status,
          data: null,
          message: response.data && response.data.message 
            ? response.data.message 
            : 'Failed to load response. Please try again.'
        };
      }
      return response;
    })
    .catch(error => {
      console.error('Error getting response by ID:', error);
      return {
        error: true,
        data: null,
        message: 'Failed to load response. Please try again later.'
      };
    });
  }

  submitResponse(publicUrl, responseData) {
    console.log('Submitting response:', publicUrl, responseData);
    return axios.post(`/api/forms/public/${publicUrl}/submit`, responseData, axiosConfig)
    .then(response => {
      console.log('Submit response response:', response);
      if (response.status !== 200) {
        console.warn('Submit response returned non-200 status:', response.status);
        return {
          error: true,
          status: response.status,
          message: response.data && response.data.message 
            ? response.data.message 
            : 'Failed to submit response. Please try again.'
        };
      }
      return response;
    })
    .catch(error => {
      console.error('Error submitting response:', error);
      return {
        error: true,
        message: 'Failed to submit response. Please try again later.'
      };
    });
  }

  /**
   * Download all responses for a form as CSV.
   * 
   * @param {number} formId - The ID of the form
   * @returns {Promise} - A promise that resolves to the CSV file
   */
  downloadFormResponses(formId) {
    console.log('Downloading form responses:', formId);

    // Use window.open for direct download
    const token = authService.getCurrentUser()?.token;
    if (!token) {
      console.error('No authentication token found');
      return Promise.reject('Authentication required');
    }

    const url = `/api/forms/${formId}/responses/download`;
    window.open(url + '?token=' + token, '_blank');

    return Promise.resolve({ success: true });
  }

  /**
   * Download a specific response as CSV.
   * 
   * @param {number} responseId - The ID of the response
   * @returns {Promise} - A promise that resolves to the CSV file
   */
  downloadResponse(responseId) {
    console.log('Downloading response:', responseId);

    // Use window.open for direct download
    const token = authService.getCurrentUser()?.token;
    if (!token) {
      console.error('No authentication token found');
      return Promise.reject('Authentication required');
    }

    const url = `/api/responses/${responseId}/download`;
    window.open(url + '?token=' + token, '_blank');

    return Promise.resolve({ success: true });
  }

  /**
   * Download a respondent's response as CSV.
   * 
   * @param {number} responseId - The ID of the response
   * @returns {Promise} - A promise that resolves to the CSV file
   */
  downloadMyResponse(responseId) {
    console.log('Downloading my response:', responseId);

    // Use window.open for direct download
    const token = authService.getCurrentUser()?.token;
    if (!token) {
      console.error('No authentication token found');
      return Promise.reject('Authentication required');
    }

    const url = `/api/responses/my/${responseId}/download`;
    window.open(url + '?token=' + token, '_blank');

    return Promise.resolve({ success: true });
  }

  /**
   * Get all responses submitted by the current user.
   * 
   * @returns {Promise} - A promise that resolves to the list of responses
   */
  getMyResponses() {
    console.log('Getting my responses');
    return axios.get('/api/responses/my', { 
      headers: authService.getAuthHeader(),
      ...axiosConfig
    })
    .then(response => {
      console.log('Get my responses response:', response);
      if (response.status !== 200) {
        console.warn('Get my responses returned non-200 status:', response.status);
        return {
          error: true,
          status: response.status,
          data: [],
          message: response.data && response.data.message 
            ? response.data.message 
            : 'Failed to load responses. Please try again.'
        };
      }
      return response;
    })
    .catch(error => {
      console.error('Error getting my responses:', error);
      return {
        error: true,
        data: [],
        message: 'Failed to load responses. Please try again later.'
      };
    });
  }
}

export default new FormService();
