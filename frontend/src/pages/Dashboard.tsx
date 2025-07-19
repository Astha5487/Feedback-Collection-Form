import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon, TrashIcon, EyeIcon, ShareIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import formService, { Form } from '../services/formService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await formService.getAllForms();
        setForms(data);
      } catch (err: any) {
        setError('Failed to load forms. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  const handleDeleteForm = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      try {
        await formService.deleteForm(id);
        setForms(forms.filter(form => form.id !== id));
      } catch (err: any) {
        setError('Failed to delete form. Please try again.');
        console.error(err);
      }
    }
  };

  const handleCopyLink = (publicUrl: string) => {
    const url = `${window.location.origin}/form/${publicUrl}`;
    navigator.clipboard.writeText(url)
        .then(() => {
          setCopySuccess(publicUrl);
          setTimeout(() => setCopySuccess(null), 2000);
        })
        .catch(() => {
          setError('Failed to copy link. Please try manually.');
        });
  };


  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading forms...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Your Forms</h1>
              <Link
                  to="/create-form"
                  className="btn btn-primary"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create New Form
              </Link>
            </div>

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

            {forms.length === 0 ? (
                <div className="bg-white shadow-soft rounded-lg p-8 text-center">
                  <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <PlusIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
                  <p className="text-gray-500 mb-6">Create your first feedback form to start collecting responses.</p>
                  <Link
                      to="/create-form"
                      className="btn btn-primary"
                  >
                    Create Your First Form
                  </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {forms.map((form) => (
                      <motion.div
                          key={form.id}
                          className="bg-white shadow-soft rounded-lg overflow-hidden"
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      >
                        <div className="px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500">
                          <h3 className="text-lg font-medium text-white truncate">{form.title}</h3>
                        </div>
                        <div className="px-6 py-4">
                          <p className="text-gray-500 text-sm mb-4">
                            {form.description ? (
                                form.description.length > 100
                                    ? `${form.description.substring(0, 100)}...`
                                    : form.description
                            ) : (
                                'No description'
                            )}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <span className="mr-2">Questions:</span>
                            <span className="font-medium text-gray-900">{form.questions.length}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">Created:</span>
                            <span className="font-medium text-gray-900">
                        {(() => {
                          try {
                            if (form.createdAt) {
                              const date = new Date(form.createdAt);
                              if (isNaN(date.getTime())) throw new Error('Invalid date');
                              return date.toLocaleDateString();
                            }
                            return 'N/A';
                          } catch (err) {
                            console.error('Invalid createdAt:', form.createdAt);
                            return 'Invalid Date';
                          }
                        })()}

                      </span>
                          </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex justify-between">
                          <div className="flex space-x-2">
                            <button
                                onClick={() => navigate(`/forms/${form.id}`)}
                                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full"
                                title="View Responses"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </button>
                            {form.publicUrl && (
                                <button
                                    onClick={() => handleCopyLink(form.publicUrl!)}
                                    className={`p-2 rounded-full ${
                                        copySuccess === form.publicUrl
                                            ? 'text-green-600 hover:text-green-700 hover:bg-green-100'
                                            : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                                    }`}
                                    title="Copy Share Link"
                                >
                                  {copySuccess === form.publicUrl ? (
                                      <ClipboardIcon className="h-5 w-5" />
                                  ) : (
                                      <ShareIcon className="h-5 w-5" />
                                  )}
                                </button>
                            )}

                          </div>
                          <button
                              onClick={() => form.id && handleDeleteForm(form.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-full"
                              title="Delete Form"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </motion.div>
                  ))}
                </div>
            )}
          </motion.div>
        </div>
      </div>
  );
};

export default Dashboard;