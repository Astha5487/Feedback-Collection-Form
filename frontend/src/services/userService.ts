import api from './api';

// Types
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phoneNo: string;
  profilePicture: string;
  bio: string;
  location: string;
  organization: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  phoneNo?: string;
  profilePicture?: string;
  bio?: string;
  location?: string;
  organization?: string;
}

// User service
const userService = {
  // Get user profile
  getUserProfile: async () => {
    const response = await api.get<UserProfile>('/users/profile');
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (updateProfileRequest: UpdateProfileRequest) => {
    const response = await api.put('/users/profile', updateProfileRequest);
    return response.data;
  },

  // Upload profile picture (base64)
  uploadProfilePicture: async (base64Image: string) => {
    const updateRequest: UpdateProfileRequest = {
      profilePicture: base64Image
    };
    return await userService.updateUserProfile(updateRequest);
  }
};

export default userService;