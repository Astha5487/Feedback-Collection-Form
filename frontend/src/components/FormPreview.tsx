import React from 'react';
import { Form, Question, QuestionType } from '../services/formService';

interface FormPreviewProps {
  form: Form;
  onClose: () => void;
}

const FormPreview: React.FC<FormPreviewProps> = ({ form, onClose }) => {
  // Function to render different question types
  const renderQuestion = (question: Question, index: number) => {
    const questionNumber = index + 1;
    
    return (
      <div key={index} className="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-start mb-2">
          <span className="flex-shrink-0 bg-primary-100 text-primary-800 font-medium rounded-full h-6 w-6 flex items-center justify-center mr-2">
            {questionNumber}
          </span>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {question.text}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </h3>
            {question.description && (
              <p className="mt-1 text-sm text-gray-500">{question.description}</p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          {renderQuestionInput(question)}
        </div>
      </div>
    );
  };
  
  // Function to render the appropriate input for each question type
  const renderQuestionInput = (question: Question) => {
    switch (question.type) {
      case QuestionType.TEXT:
        return (
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            rows={3}
            placeholder="Your answer"
            disabled
          />
        );
        
      case QuestionType.TEXT_WITH_LIMIT:
        return (
          <div>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Your answer"
              disabled
            />
            <p className="mt-1 text-sm text-gray-500">
              Maximum {question.wordLimit} words
            </p>
          </div>
        );
        
      case QuestionType.SINGLE_SELECT:
        return (
          <div className="space-y-2">
            {question.options?.map((option, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  disabled
                />
                <label className="ml-2 block text-sm text-gray-700">
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        );
        
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            disabled
          >
            <option value="">Select an option</option>
            {question.options?.map((option, i) => (
              <option key={i} value={i}>
                {option.text}
              </option>
            ))}
          </select>
        );
        
      case QuestionType.MULTI_SELECT:
        return (
          <div className="space-y-2">
            {question.options?.map((option, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  disabled
                />
                <label className="ml-2 block text-sm text-gray-700">
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        );
        
      case QuestionType.RATING_SCALE:
        return (
          <div className="flex items-center space-x-2 mt-2">
            {Array.from({ length: (question.maxRating || 5) - (question.minRating || 1) + 1 }).map((_, i) => {
              const value = (question.minRating || 1) + i;
              return (
                <button
                  key={i}
                  type="button"
                  className={`h-10 w-10 rounded-full flex items-center justify-center border ${
                    value === (question.defaultRating || 3)
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                  disabled
                >
                  {value}
                </button>
              );
            })}
          </div>
        );
        
      case QuestionType.DATE:
        return (
          <div>
            <input
              type="date"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              disabled
            />
            <p className="mt-1 text-xs text-gray-500">
              Format: {question.dateFormat || 'YYYY-MM-DD'}
              {question.minDate && ` | Min: ${question.minDate}`}
              {question.maxDate && ` | Max: ${question.maxDate}`}
            </p>
          </div>
        );
        
      default:
        return <p className="text-gray-500">Preview not available for this question type.</p>;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Form Preview</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-grow">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{form.title}</h1>
            {form.description && (
              <p className="mt-2 text-gray-600">{form.description}</p>
            )}
          </div>
          
          {form.questions.map(renderQuestion)}
          
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="btn btn-primary"
              disabled
            >
              Submit
            </button>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex justify-between">
          <p className="text-sm text-gray-500">
            This is a preview of how your form will appear to respondents.
          </p>
          <button
            onClick={onClose}
            className="btn btn-outline"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormPreview;