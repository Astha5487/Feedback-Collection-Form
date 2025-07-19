import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import formService, { QuestionType } from '../services/formService';
import responseService from '../services/responseService';
import { downloadResponsePdf } from '../utils/pdfGenerator';

interface FormAnswer {
  questionId: number;
  text?: string;                  // For backward compatibility and general use
  textValue?: string;             // For TEXT and TEXT_WITH_LIMIT
  selectedOptionId?: number;      // For SINGLE_SELECT and MULTIPLE_CHOICE
  selectedOptionIds?: number[];   // For MULTI_SELECT
  rating?: number;                // For RATING_SCALE
  dateValue?: string;             // For DATE
}

const PublicForm = () => {
  const { publicUrl } = useParams<{ publicUrl: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [respondentName, setRespondentName] = useState('');
  const [answers, setAnswers] = useState<FormAnswer[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchForm = async () => {
      if (!publicUrl) return;
      
      try {
        const formData = await formService.getFormByPublicUrl(publicUrl);
        setForm(formData);
        
        // Initialize answers array with empty answers for each question based on question type
        const initialAnswers = formData.questions.map((question: any) => {
          const baseAnswer = {
            questionId: question.id,
            text: '' // Keep for backward compatibility
          };
          
          // Add type-specific properties
          switch (question.type) {
            case QuestionType.TEXT:
            case QuestionType.TEXT_WITH_LIMIT:
              return {
                ...baseAnswer,
                textValue: ''
              };
              
            case QuestionType.SINGLE_SELECT:
            case QuestionType.MULTIPLE_CHOICE:
              return {
                ...baseAnswer,
                selectedOptionId: undefined
              };
              
            case QuestionType.MULTI_SELECT:
              return {
                ...baseAnswer,
                selectedOptionIds: []
              };
              
            case QuestionType.RATING_SCALE:
              return {
                ...baseAnswer,
                rating: question.defaultRating || undefined
              };
              
            case QuestionType.DATE:
              return {
                ...baseAnswer,
                dateValue: ''
              };
              
            default:
              return baseAnswer;
          }
        });
        
        setAnswers(initialAnswers);
      } catch (err: any) {
        setError('Failed to load form. It may have been deleted or the link is invalid.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [publicUrl]);

  const handleAnswerChange = (questionId: number, questionType: QuestionType, value: any) => {
    setAnswers(prevAnswers => 
      prevAnswers.map(answer => {
        if (answer.questionId !== questionId) {
          return answer;
        }
        
        // Update the appropriate property based on question type
        switch (questionType) {
          case QuestionType.TEXT:
          case QuestionType.TEXT_WITH_LIMIT:
            return { 
              ...answer, 
              text: value, // Keep for backward compatibility
              textValue: value 
            };
            
          case QuestionType.SINGLE_SELECT:
          case QuestionType.MULTIPLE_CHOICE:
            return { 
              ...answer, 
              text: value.toString(), // Keep for backward compatibility
              selectedOptionId: value 
            };
            
          case QuestionType.MULTI_SELECT:
            // For multi-select, value is an array of option IDs
            return { 
              ...answer, 
              text: value.join(','), // Keep for backward compatibility
              selectedOptionIds: value 
            };
            
          case QuestionType.RATING_SCALE:
            return { 
              ...answer, 
              text: value.toString(), // Keep for backward compatibility
              rating: value 
            };
            
          case QuestionType.DATE:
            return { 
              ...answer, 
              text: value, // Keep for backward compatibility
              dateValue: value 
            };
            
          default:
            return { ...answer, text: value };
        }
      })
    );
    
    // Clear validation error when user types
    if (validationErrors[questionId]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<number, string> = {};
    let isValid = true;
    
    form.questions.forEach((question: any) => {
      const answer = answers.find(a => a.questionId === question.id);
      if (!answer) {
        if (question.required) {
          errors[question.id] = 'This question requires an answer';
          isValid = false;
        }
        return;
      }
      
      // Validate based on question type
      switch (question.type) {
        case QuestionType.TEXT:
          if (question.required && (!answer.textValue || !answer.textValue.trim())) {
            errors[question.id] = 'This question requires an answer';
            isValid = false;
          }
          break;
          
        case QuestionType.TEXT_WITH_LIMIT:
          if (question.required && (!answer.textValue || !answer.textValue.trim())) {
            errors[question.id] = 'This question requires an answer';
            isValid = false;
          } else if (answer.textValue && question.wordLimit) {
            // Check word count
            const wordCount = answer.textValue.trim().split(/\s+/).length;
            if (wordCount > question.wordLimit) {
              errors[question.id] = `Response exceeds the ${question.wordLimit} word limit`;
              isValid = false;
            }
          }
          break;
          
        case QuestionType.SINGLE_SELECT:
        case QuestionType.MULTIPLE_CHOICE:
          if (question.required && answer.selectedOptionId === undefined) {
            errors[question.id] = 'Please select an option';
            isValid = false;
          }
          break;
          
        case QuestionType.MULTI_SELECT:
          if (question.required && (!answer.selectedOptionIds || answer.selectedOptionIds.length === 0)) {
            errors[question.id] = 'Please select at least one option';
            isValid = false;
          }
          break;
          
        case QuestionType.RATING_SCALE:
          if (question.required && answer.rating === undefined) {
            errors[question.id] = 'Please select a rating';
            isValid = false;
          } else if (answer.rating !== undefined) {
            // Check if rating is within allowed range
            if (question.minRating !== undefined && answer.rating < question.minRating) {
              errors[question.id] = `Rating must be at least ${question.minRating}`;
              isValid = false;
            } else if (question.maxRating !== undefined && answer.rating > question.maxRating) {
              errors[question.id] = `Rating must be at most ${question.maxRating}`;
              isValid = false;
            }
          }
          break;
          
        case QuestionType.DATE:
          if (question.required && (!answer.dateValue || !answer.dateValue.trim())) {
            errors[question.id] = 'Please select a date';
            isValid = false;
          } else if (answer.dateValue) {
            // Check if date is within allowed range
            const selectedDate = new Date(answer.dateValue);
            if (question.minDate && selectedDate < new Date(question.minDate)) {
              errors[question.id] = `Date must be on or after ${question.minDate}`;
              isValid = false;
            } else if (question.maxDate && selectedDate > new Date(question.maxDate)) {
              errors[question.id] = `Date must be on or before ${question.maxDate}`;
              isValid = false;
            }
          }
          break;
          
        default:
          // Fallback to checking text property for backward compatibility
          if (question.required && (!answer.text || !answer.text.trim())) {
            errors[question.id] = 'This question requires an answer';
            isValid = false;
          }
      }
    });
    
    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorId = Object.keys(validationErrors)[0];
      if (firstErrorId) {
        const element = document.getElementById(`question-${firstErrorId}`);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    try {
      // Filter out empty answers for non-required questions
      const filledAnswers = answers.filter(answer => answer.text.trim() !== '');
      
      await responseService.submitResponse({
        formId: form.id,
        respondentName: respondentName.trim() || 'Anonymous',
        answers: filledAnswers
      });
      
      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError('Failed to submit your response. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white shadow-soft rounded-lg">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    // Create a response object for PDF/CSV generation
    const submittedResponse = {
      id: Date.now(), // Temporary ID for the response
      formId: form.id,
      respondentName: respondentName || 'Anonymous',
      answers: answers,
      createdAt: new Date().toISOString()
    };

    // Function to generate and download CSV
    const downloadCSV = () => {
      // Create headers
      const headers = ['Question', 'Answer'];
      
      // Create rows
      const rows = form.questions.map((question: any) => {
        const answer = answers.find(a => a.questionId === question.id);
        let answerText = '';
        
        // Format answer based on question type
        switch (question.type) {
          case QuestionType.TEXT:
          case QuestionType.TEXT_WITH_LIMIT:
            answerText = answer?.textValue || '';
            break;
            
          case QuestionType.SINGLE_SELECT:
          case QuestionType.MULTIPLE_CHOICE:
            if (answer?.selectedOptionId !== undefined) {
              const option = question.options.find((o: any) => o.id === answer.selectedOptionId);
              answerText = option ? option.text : '';
            }
            break;
            
          case QuestionType.MULTI_SELECT:
            if (answer?.selectedOptionIds?.length) {
              answerText = answer.selectedOptionIds
                .map(id => {
                  const option = question.options.find((o: any) => o.id === id);
                  return option ? option.text : '';
                })
                .filter(text => text)
                .join(', ');
            }
            break;
            
          case QuestionType.RATING_SCALE:
            answerText = answer?.rating !== undefined ? answer.rating.toString() : '';
            break;
            
          case QuestionType.DATE:
            answerText = answer?.dateValue || '';
            break;
            
          default:
            answerText = answer?.text || '';
        }
        
        return [question.text, answerText];
      });
      
      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${form.title}_response.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md mx-auto p-8 bg-white shadow-soft rounded-lg"
        >
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            Your response has been successfully submitted. We appreciate your feedback!
          </p>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-medium text-gray-700 mb-3">Download Your Response</h3>
            <div className="flex space-x-4">
              {/*<button*/}
              {/*  onClick={() => downloadResponsePdf(form, submittedResponse, `${form.title}_response.pdf`)}*/}
              {/*  className="flex-1 btn btn-primary"*/}
              {/*>*/}
              {/*  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">*/}
              {/*    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />*/}
              {/*  </svg>*/}
              {/*  PDF*/}
              {/*</button>*/}
              <button
                onClick={downloadCSV}
                className="flex-1 btn btn-secondary"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                CSV
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                // Reset form to submit another response
                setSuccess(false);
                setRespondentName('');
                
                // Initialize answers array with empty answers for each question based on question type
                const initialAnswers = form.questions.map((question: any) => {
                  const baseAnswer = {
                    questionId: question.id,
                    text: '' // Keep for backward compatibility
                  };
                  
                  // Add type-specific properties
                  switch (question.type) {
                    case QuestionType.TEXT:
                    case QuestionType.TEXT_WITH_LIMIT:
                      return {
                        ...baseAnswer,
                        textValue: ''
                      };
                      
                    case QuestionType.SINGLE_SELECT:
                    case QuestionType.MULTIPLE_CHOICE:
                      return {
                        ...baseAnswer,
                        selectedOptionId: undefined
                      };
                      
                    case QuestionType.MULTI_SELECT:
                      return {
                        ...baseAnswer,
                        selectedOptionIds: []
                      };
                      
                    case QuestionType.RATING_SCALE:
                      return {
                        ...baseAnswer,
                        rating: question.defaultRating || undefined
                      };
                      
                    case QuestionType.DATE:
                      return {
                        ...baseAnswer,
                        dateValue: ''
                      };
                      
                    default:
                      return baseAnswer;
                  }
                });
                
                setAnswers(initialAnswers);
                setValidationErrors({});
              }}
              className="btn btn-outline w-full"
            >
              Submit Another Response
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn btn-outline w-full"
            >
              Return to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white shadow-soft rounded-lg">
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-6">
            <p>Form not found. The link may be invalid or the form has been deleted.</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-soft rounded-lg overflow-hidden"
        >
          <div className="px-6 py-8 bg-gradient-to-r from-primary-500 to-secondary-500">
            <h1 className="text-2xl font-bold text-white">{form.title}</h1>
            {form.description && (
              <p className="mt-2 text-white text-opacity-90">{form.description}</p>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-8">
              <label htmlFor="respondentName" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                id="respondentName"
                value={respondentName}
                onChange={(e) => setRespondentName(e.target.value)}
                placeholder="Anonymous"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="space-y-8">
              {form.questions.map((question: any, index: number) => (
                <div 
                  key={question.id} 
                  id={`question-${question.id}`}
                  className={`p-4 rounded-lg ${validationErrors[question.id] ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}
                >
                  <div className="flex items-start mb-2">
                    <span className="flex-shrink-0 bg-primary-100 text-primary-800 font-medium rounded-full h-6 w-6 flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    <div>
                      <label htmlFor={`question-${question.id}-input`} className="block text-base font-medium text-gray-900">
                        {question.text}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {question.description && (
                        <p className="mt-1 text-sm text-gray-500">{question.description}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* TEXT input */}
                  {question.type === QuestionType.TEXT && (
                    <div>
                      <textarea
                        id={`question-${question.id}-input`}
                        value={answers.find(a => a.questionId === question.id)?.textValue || ''}
                        onChange={(e) => handleAnswerChange(question.id, QuestionType.TEXT, e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          validationErrors[question.id] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Type your answer here..."
                      />
                    </div>
                  )}
                  
                  {/* TEXT_WITH_LIMIT input */}
                  {question.type === QuestionType.TEXT_WITH_LIMIT && (
                    <div>
                      <textarea
                        id={`question-${question.id}-input`}
                        value={answers.find(a => a.questionId === question.id)?.textValue || ''}
                        onChange={(e) => handleAnswerChange(question.id, QuestionType.TEXT_WITH_LIMIT, e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          validationErrors[question.id] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Type your answer here..."
                      />
                      <div className="mt-1 flex justify-between text-xs text-gray-500">
                        <span>Word limit: {question.wordLimit}</span>
                        <span>
                          Words: {answers.find(a => a.questionId === question.id)?.textValue 
                            ? answers.find(a => a.questionId === question.id)?.textValue?.trim().split(/\s+/).length || 0
                            : 0}
                          /{question.wordLimit}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* SINGLE_SELECT input */}
                  {question.type === QuestionType.SINGLE_SELECT && (
                    <div className="space-y-2">
                      {question.options.map((option: any) => (
                        <div key={option.id} className="flex items-center">
                          <input
                            type="radio"
                            id={`option-${option.id}`}
                            name={`question-${question.id}`}
                            checked={answers.find(a => a.questionId === question.id)?.selectedOptionId === option.id}
                            onChange={() => handleAnswerChange(question.id, QuestionType.SINGLE_SELECT, option.id)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          />
                          <label htmlFor={`option-${option.id}`} className="ml-2 block text-sm text-gray-700">
                            {option.text}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* MULTIPLE_CHOICE input */}
                  {question.type === QuestionType.MULTIPLE_CHOICE && (
                    <div>
                      <select
                        id={`question-${question.id}-select`}
                        value={answers.find(a => a.questionId === question.id)?.selectedOptionId || ''}
                        onChange={(e) => handleAnswerChange(
                          question.id, 
                          QuestionType.MULTIPLE_CHOICE, 
                          e.target.value ? parseInt(e.target.value) : undefined
                        )}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          validationErrors[question.id] ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select an option</option>
                        {question.options.map((option: any) => (
                          <option key={option.id} value={option.id}>
                            {option.text}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {/* MULTI_SELECT input */}
                  {question.type === QuestionType.MULTI_SELECT && (
                    <div className="space-y-2">
                      {question.options.map((option: any) => {
                        const answer = answers.find(a => a.questionId === question.id);
                        const isSelected = answer?.selectedOptionIds?.includes(option.id);
                        
                        return (
                          <div key={option.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`option-${option.id}`}
                              checked={isSelected || false}
                              onChange={() => {
                                const currentIds = answer?.selectedOptionIds || [];
                                const newIds = isSelected
                                  ? currentIds.filter(id => id !== option.id)
                                  : [...currentIds, option.id];
                                handleAnswerChange(question.id, QuestionType.MULTI_SELECT, newIds);
                              }}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`option-${option.id}`} className="ml-2 block text-sm text-gray-700">
                              {option.text}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* RATING_SCALE input */}
                  {question.type === QuestionType.RATING_SCALE && (
                    <div>
                      <div className="flex items-center space-x-2 mt-2">
                        {Array.from({ length: (question.maxRating || 5) - (question.minRating || 1) + 1 }).map((_, i) => {
                          const value = (question.minRating || 1) + i;
                          const answer = answers.find(a => a.questionId === question.id);
                          const isSelected = answer?.rating === value;
                          
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleAnswerChange(question.id, QuestionType.RATING_SCALE, value)}
                              className={`h-10 w-10 rounded-full flex items-center justify-center border ${
                                isSelected
                                  ? 'bg-primary-500 text-white border-primary-500'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* DATE input */}
                  {question.type === QuestionType.DATE && (
                    <div>
                      <input
                        type="date"
                        id={`question-${question.id}-date`}
                        value={answers.find(a => a.questionId === question.id)?.dateValue || ''}
                        onChange={(e) => handleAnswerChange(question.id, QuestionType.DATE, e.target.value)}
                        min={question.minDate || ''}
                        max={question.maxDate || ''}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                          validationErrors[question.id] ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {(question.minDate || question.maxDate) && (
                        <div className="mt-1 text-xs text-gray-500">
                          {question.minDate && <span>From: {question.minDate}</span>}
                          {question.minDate && question.maxDate && <span> • </span>}
                          {question.maxDate && <span>To: {question.maxDate}</span>}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {validationErrors[question.id] && (
                    <p className="mt-2 text-sm text-red-600">{validationErrors[question.id]}</p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Submit Response
              </button>
            </div>
          </form>
        </motion.div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Powered by Feedback Collection Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicForm;