import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import formService from '../services/form.service';

const FormView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadForm();
  }, [id]);

  const loadForm = () => {
    setLoading(true);
    formService.getFormById(id)
      .then(response => {
        setForm(response.data);
        setLoading(false);
      })
      .catch(error => {
        const message = 
          (error.response && 
           error.response.data && 
           error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
        setLoading(false);
      });
  };

  const copyPublicUrl = () => {
    if (!form) return;
    
    const url = `${window.location.origin}/form/${form.publicUrl}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Public URL copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy URL. Please copy it manually: ' + url);
      });
  };

  const handleDelete = () => {
    if (!form) return;
    
    if (window.confirm('Are you sure you want to delete this form?')) {
      formService.deleteForm(id)
        .then(() => {
          navigate('/forms');
        })
        .catch(error => {
          const message = 
            (error.response && 
             error.response.data && 
             error.response.data.message) ||
            error.message ||
            error.toString();
          setError(message);
        });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mt-4" role="alert">
        <strong className="font-bold">Not Found!</strong>
        <span className="block sm:inline"> The requested form could not be found.</span>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
          <div className="flex space-x-2">
            <button
              onClick={copyPublicUrl}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Copy Public URL
            </button>
            <Link
              to={`/forms/${id}/responses`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Responses ({form.responseCount})
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Form Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Created on {new Date(form.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {form.description && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm text-gray-900">{form.description}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Public URL</h3>
              <p className="mt-1 text-sm text-blue-600 break-all">
                {`${window.location.origin}/form/${form.publicUrl}`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Questions</h3>
          </div>
          <div className="border-t border-gray-200">
            {form.questions.length === 0 ? (
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                This form has no questions.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {form.questions.map((question, index) => (
                  <li key={question.id} className="px-4 py-4 sm:px-6">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {index + 1}. {question.text}
                      </span>
                      {question.required && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      Type: {question.type === 'TEXT' ? 'Text Input' : 'Multiple Choice'}
                    </div>
                    {question.type === 'MULTIPLE_CHOICE' && question.options && question.options.length > 0 && (
                      <div className="ml-4">
                        <ul className="list-disc pl-5">
                          {question.options.map(option => (
                            <li key={option.id} className="text-sm text-gray-600">
                              {option.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Link
            to="/forms"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Forms
          </Link>
          <div className="flex space-x-2">
            <Link
              to={`/form/${form.publicUrl}`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Preview Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormView;