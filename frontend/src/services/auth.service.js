import axios from 'axios';

// Use relative URL to leverage the proxy configuration in vite.config.js
const API_URL = "/api/auth/";

class AuthService {
    login(username, password) {
        console.log('Sending login request to:', API_URL + "signin");

        return axios
            .post(API_URL + "signin", {
                username,
                password
            }, {
                timeout: 10000, // Increased timeout
                validateStatus: function (status) {
                    // Accept any status code to handle errors gracefully
                    return true;
                }
            })
            .then(response => {
                console.log('Login response received:', response);

                if (response.status === 200 && (response.data.token || response.data.accessToken)) {
                    // Ensure we have a token property for consistency
                    if (response.data.accessToken && !response.data.token) {
                        response.data.token = response.data.accessToken;
                    }
                    localStorage.setItem("user", JSON.stringify(response.data));
                    return response.data;
                } else {
                    console.warn('Login returned non-200 status:', response.status);
                    if (response.data && response.data.message) {
                        console.warn('Error message:', response.data.message);
                    }
                    return {
                        error: true,
                        message: response.data && response.data.message 
                            ? response.data.message 
                            : 'Login failed. Please check your credentials.'
                    };
                }
            })
            .catch(error => {
                console.error('Login failed with exception:', error);

                // Log detailed error information
                if (error.response) {
                    console.error('Error status:', error.response.status);
                    console.error('Error data:', error.response.data);
                    console.error('Error headers:', error.response.headers);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error during request setup:', error.message);
                }

                // Create a synthetic response to avoid breaking the UI
                return {
                    error: true,
                    message: 'Login failed. Please try again later. Error: ' + 
                        (error.response && error.response.data && error.response.data.message 
                            ? error.response.data.message 
                            : error.message || 'Unknown error')
                };
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    forgotPassword(username) {
        console.log('Sending forgot password request to:', API_URL + "forgot-password");
        console.log('Request data:', { username });

        return axios.post(API_URL + "forgot-password", {
            username
        }, {
            timeout: 10000, // Increased timeout
            validateStatus: function (status) {
                // Accept any status code to handle errors gracefully
                return true;
            }
        })
        .then(response => {
            console.log('Forgot password response received:', response);

            // Check if the response contains an error message
            if (response.status !== 200) {
                console.warn('Forgot password returned non-200 status:', response.status);
                if (response.data && response.data.message) {
                    console.warn('Error message:', response.data.message);
                }
                return {
                    error: true,
                    message: response.data && response.data.message 
                        ? response.data.message 
                        : 'Password reset failed. Please try again.'
                };
            }

            return {
                success: true,
                message: response.data && response.data.message 
                    ? response.data.message 
                    : 'A new password has been sent to your email.'
            };
        })
        .catch(error => {
            console.error('Forgot password failed with exception:', error);

            // Log detailed error information
            if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error during request setup:', error.message);
            }

            // Create a synthetic response to avoid breaking the UI
            return {
                error: true,
                message: 'Password reset failed. Please try again later. Error: ' + 
                    (error.response && error.response.data && error.response.data.message 
                        ? error.response.data.message 
                        : error.message || 'Unknown error')
            };
        });
    }

    register(username, email, fullName, phoneNo, password) {
        console.log('Sending registration request to:', API_URL + "signup");
        console.log('Request data:', { username, email, fullName, phoneNo, password, roles: ["ROLE_USER"] }); // Using exact role name from backend

        return axios.post(API_URL + "signup", {
            username,
            email,
            fullName,
            phoneNo,
            password,
            roles: ["ROLE_USER"] // Using exact role name from backend
        }, {
            timeout: 10000, // Increased timeout
            validateStatus: function (status) {
                // Accept any status code to handle errors gracefully
                return true;
            }
        })
        .then(response => {
            console.log('Registration response received:', response);

            // Check if the response contains an error message
            if (response.status !== 200) {
                console.warn('Registration returned non-200 status:', response.status);
                if (response.data && response.data.message) {
                    console.warn('Error message:', response.data.message);
                }
            }

            return response;
        })
        .catch(error => {
            console.error('Registration failed with exception:', error);

            // Log detailed error information
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
                console.error('Error headers:', error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error during request setup:', error.message);
            }

            // Create a synthetic response to avoid breaking the UI
            return {
                status: 500,
                data: {
                    message: 'Registration failed. Please try again later. Error: ' + 
                        (error.response && error.response.data && error.response.data.message 
                            ? error.response.data.message 
                            : error.message || 'Unknown error')
                }
            };
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

    isAuthenticated() {
        const user = this.getCurrentUser();
        return !!user && !!user.token;
    }

    isAdmin() {
        const user = this.getCurrentUser();
        if (user && user.roles) {
            return user.roles.includes("ROLE_ADMIN");
        }
        return false;
    }

    getAuthHeader() {
        const user = this.getCurrentUser();
        if (user && user.token) {
            return { Authorization: 'Bearer ' + user.token };
        } else {
            return {};
        }
    }
}

export default new AuthService();
