import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import formService from '../services/form.service';

const FormSubmit = () => {
  const { publicUrl } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    respondentName: '',
    respondentEmail: '',
    answers: []
  });

  useEffect(() => {
    loadForm();
  }, [publicUrl]);

  const loadForm = async () => {
    setLoading(true);
    try {
      const response = await formService.getFormByPublicUrl(publicUrl);
      const formData = response.data;
      setForm(formData);

      // Initialize answers array with empty values for each question
      const initialAnswers = formData.questions.map(question => ({
        questionId: question.id,
        textAnswer: '',
        selectedOption: null,
        ratingValue: null
      }));

      setFormData(prevState => ({
        ...prevState,
        answers: initialAnswers
      }));

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTextAnswerChange = (questionId, value) => {
    setFormData(prevState => ({
      ...prevState,
      answers: prevState.answers.map(answer => 
        answer.questionId === questionId 
          ? { ...answer, textAnswer: value } 
          : answer
      )
    }));
  };

  const handleOptionSelect = (questionId, optionId) => {
    setFormData(prevState => ({
      ...prevState,
      answers: prevState.answers.map(answer => 
        answer.questionId === questionId 
          ? { ...answer, selectedOption: optionId } 
          : answer
      )
    }));
  };

  const handleRatingChange = (questionId, value) => {
    setFormData(prevState => ({
      ...prevState,
      answers: prevState.answers.map(answer => 
        answer.questionId === questionId 
          ? { ...answer, ratingValue: value } 
          : answer
      )
    }));
  };

  const validateForm = () => {
    // Check required questions
    const unansweredRequiredQuestions = form.questions.filter(question => {
      if (!question.required) return false;

      const answer = formData.answers.find(a => a.questionId === question.id);
      if (!answer) return true;

      if (question.type === 'TEXT') {
        return !answer.textAnswer || answer.textAnswer.trim() === '';
      } else if (question.type === 'MULTIPLE_CHOICE') {
        return answer.selectedOption === null;
      } else if (question.type === 'RATING') {
        return answer.ratingValue === null;
      }

      return true;
    });

    if (unansweredRequiredQuestions.length > 0) {
      setError(`Please answer all required questions (${unansweredRequiredQuestions.length} unanswered).`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await formService.submitResponse(publicUrl, formData);
      setSuccess(true);
      setSubmitting(false);

      // Reset form after successful submission
      setFormData({
        respondentName: '',
        respondentEmail: '',
        answers: form.questions.map(question => ({
          questionId: question.id,
          textAnswer: '',
          selectedOption: null,
          ratingValue: null
        }))
      });

      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (error) {
      const message = 
        (error.response && 
         error.response.data && 
         error.response.data.message) ||
        error.message ||
        error.toString();
      setError(message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !form) {
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

  if (success) {
    return (
      <div className="py-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Your response has been submitted successfully.</span>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
            <p className="text-gray-600 mb-6">Your feedback is valuable to us.</p>
            <button
              onClick={() => {
                setSuccess(false);
                window.location.reload();
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
            {form.description && (
              <p className="mt-2 text-gray-600">{form.description}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Your Information</h2>
              <p className="mt-1 text-sm text-gray-500">Optional, but helps us know who responded.</p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="respondentName" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="respondentName"
                    id="respondentName"
                    value={formData.respondentName}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="respondentEmail" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="respondentEmail"
                    id="respondentEmail"
                    value={formData.respondentEmail}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">Questions</h2>
              <p className="mt-1 text-sm text-gray-500">
                Questions marked with <span className="text-red-500">*</span> are required.
              </p>
            </div>
            <div className="border-t border-gray-200">
              {form.questions.map((question, index) => (
                <div key={question.id} className="px-4 py-5 sm:px-6 border-b border-gray-200 last:border-b-0">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900">
                      {index + 1}. {question.text}
                      {question.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                  </div>

                  {question.type === 'TEXT' ? (
                    <div>
                      <textarea
                        rows="3"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        value={formData.answers.find(a => a.questionId === question.id)?.textAnswer || ''}
                        onChange={(e) => handleTextAnswerChange(question.id, e.target.value)}
                        required={question.required}
                      ></textarea>
                      {question.wordLimit && (
                        <p className="mt-1 text-sm text-gray-500">
                          Word limit: {question.wordLimit} words
                        </p>
                      )}
                    </div>
                  ) : question.type === 'RATING' ? (
                    <div className="mt-4">
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            className={`h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                              formData.answers.find(a => a.questionId === question.id)?.ratingValue === value
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() => handleRatingChange(question.id, value)}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Click on a number to rate (1 = lowest, 5 = highest)
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {question.options.map((option) => (
                        <div key={option.id} className="flex items-center">
                          <input
                            id={`option-${option.id}`}
                            name={`question-${question.id}`}
                            type="radio"
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                            checked={formData.answers.find(a => a.questionId === question.id)?.selectedOption === option.id}
                            onChange={() => handleOptionSelect(question.id, option.id)}
                            required={question.required}
                          />
                          <label htmlFor={`option-${option.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                            {option.text}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {submitting ? 'Submitting...' : 'Submit Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormSubmit;
