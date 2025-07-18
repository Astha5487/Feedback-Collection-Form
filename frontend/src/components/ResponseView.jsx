import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import formService from '../services/form.service';

const ResponseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadResponse();
  }, [id]);

  const loadResponse = async () => {
    setLoading(true);
    try {
      // Get the response details
      const responseData = await formService.getResponseById(id);
      setResponse(responseData.data);

      // Get the form details to show question context
      const formData = await formService.getFormById(responseData.data.formId);
      setForm(formData.data);

      setLoading(false);
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) ||
        error.message ||
        error.toString();
      setError(message);
      setLoading(false);
    }
  };

  // Helper function to find a question by ID
  const findQuestion = (questionId) => {
    if (!form || !form.questions) return null;
    return form.questions.find(q => q.id === questionId);
  };

  // Helper function to find an option by ID
  const findOption = (question, optionId) => {
    if (!question || !question.options) return null;
    return question.options.find(o => o.id === optionId);
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

  if (!response || !form) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mt-4" role="alert">
        <strong className="font-bold">Not Found!</strong>
        <span className="block sm:inline"> The requested response could not be found.</span>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Response Details</h1>
            <p className="text-sm text-gray-500">
              For form: {form.title}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/forms/${form.id}/responses`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Responses
            </Link>
            <button
              onClick={() => formService.downloadResponse(response.id)}
              className="inline-flex items-center px-4 py-2 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download Response
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Respondent Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Submitted on {new Date(response.submittedAt).toLocaleString()}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{response.respondentName || 'Not provided'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{response.respondentEmail || 'Not provided'}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Answers</h3>
          </div>
          <div className="border-t border-gray-200">
            {response.answers.length === 0 ? (
              <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
                No answers were provided.
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {response.answers.map((answer) => {
                  const question = findQuestion(answer.questionId);
                  return (
                    <li key={answer.id} className="px-4 py-4 sm:px-6">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {question ? question.text : 'Unknown Question'}
                          {question && question.required && <span className="ml-1 text-red-500">*</span>}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        Type: {question ? (question.type === 'TEXT' ? 'Text Input' : 'Multiple Choice') : 'Unknown'}
                      </div>
                      <div className="ml-4 p-2 bg-gray-50 rounded">
                        {question && question.type === 'TEXT' ? (
                          <p className="text-sm text-gray-900">{answer.textAnswer || 'No answer provided'}</p>
                        ) : (
                          <p className="text-sm text-gray-900">
                            {answer.selectedOption ? 
                              (findOption(question, answer.selectedOption) ? 
                                findOption(question, answer.selectedOption).text : 
                                'Unknown Option') : 
                              'No option selected'}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseView;
