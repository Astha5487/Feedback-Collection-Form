import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import userService, { UserProfile, UpdateProfileRequest } from '../services/userService';
import authService from '../services/authService';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getUserProfile();
        setProfile(data);
        setFormData({
          fullName: data.fullName,
          phoneNo: data.phoneNo,
          bio: data.bio,
          location: data.location,
          organization: data.organization,
        });
        if (data.profilePicture) {
          setImagePreview(data.profilePicture);
        }
      } catch (err: any) {
        setError('Failed to load profile. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setFormData({
        ...formData,
        profilePicture: base64String,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await userService.updateUserProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh profile data
      const updatedProfile = await userService.getUserProfile();
      setProfile(updatedProfile);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white shadow-soft rounded-lg overflow-hidden">
              <div className="px-6 py-8 bg-gradient-to-r from-primary-500 to-secondary-500 sm:p-10 sm:pb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl leading-6 font-bold text-white">Your Profile</h2>
                  <div>
                    {isEditing ? (
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 pt-6 pb-8 bg-white sm:p-10">
                {error && (
                  <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">{success}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                    <div className="relative">
                      <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <label htmlFor="profile-picture" className="absolute bottom-0 right-0 bg-primary-600 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-primary-700">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <input 
                            id="profile-picture" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-900">
                      {profile?.fullName || profile?.username}
                    </h3>
                    <p className="text-gray-500">{profile?.email}</p>
                  </div>

                  <div className="md:w-2/3 md:pl-8">
                    {isEditing ? (
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                          <div>
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              value={formData.fullName || ''}
                              onChange={handleInputChange}
                              className="form-input"
                            />
                          </div>
                          <div>
                            <label htmlFor="phoneNo" className="form-label">Phone Number</label>
                            <input
                              type="text"
                              id="phoneNo"
                              name="phoneNo"
                              value={formData.phoneNo || ''}
                              onChange={handleInputChange}
                              className="form-input"
                            />
                          </div>
                          <div>
                            <label htmlFor="bio" className="form-label">Bio</label>
                            <textarea
                              id="bio"
                              name="bio"
                              rows={3}
                              value={formData.bio || ''}
                              onChange={handleInputChange}
                              className="form-input"
                            ></textarea>
                          </div>
                          <div>
                            <label htmlFor="location" className="form-label">Location</label>
                            <input
                              type="text"
                              id="location"
                              name="location"
                              value={formData.location || ''}
                              onChange={handleInputChange}
                              className="form-input"
                            />
                          </div>
                          <div>
                            <label htmlFor="organization" className="form-label">Organization</label>
                            <input
                              type="text"
                              id="organization"
                              name="organization"
                              value={formData.organization || ''}
                              onChange={handleInputChange}
                              className="form-input"
                            />
                          </div>
                          <div className="flex justify-end">
                            <button type="submit" className="btn btn-primary">
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                          <p className="mt-1 text-lg text-gray-900">{profile?.fullName || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
                          <p className="mt-1 text-lg text-gray-900">{profile?.phoneNo || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                          <p className="mt-1 text-lg text-gray-900">{profile?.bio || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Location</h4>
                          <p className="mt-1 text-lg text-gray-900">{profile?.location || 'Not provided'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Organization</h4>
                          <p className="mt-1 text-lg text-gray-900">{profile?.organization || 'Not provided'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-between">
                    <Link to="/dashboard" className="btn btn-outline">
                      Go to Dashboard
                    </Link>
                    <button onClick={handleLogout} className="btn btn-outline text-red-600 border-red-300 hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Add missing Link import
import { Link } from 'react-router-dom';

export default Profile;