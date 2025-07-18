import axios from 'axios';
import authService from './auth.service';

const API_URL = "/api/";

class ResponseService {
    submitResponse(publicUrl, responseData) {
        return axios.post(API_URL + "forms/public/" + publicUrl + "/submit", responseData)
            .then(response => response.data);
    }

    getResponsesByForm(formId) {
        return axios.get(API_URL + "forms/" + formId + "/responses", { headers: authService.getAuthHeader() })
            .then(response => response.data);
    }

    getResponseById(id) {
        return axios.get(API_URL + "responses/" + id, { headers: authService.getAuthHeader() })
            .then(response => response.data);
    }
}

export default new ResponseService();