import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import formService, { Form, Question, QuestionType } from '../services/formService';
import FormPreviewButton from '../components/FormPreviewButton';
import DraggableQuestionList from '../components/DraggableQuestionList';

const CreateForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Form>({
    title: '',
    description: '',
    questions: [
      {
        text: '',
        type: QuestionType.TEXT,
        required: false,
        options: []
      }
    ]
  });

  // Handle form title and description changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  // Handle question text and required changes
  const handleQuestionChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedQuestions = [...form.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [name]: value
    };
    setForm({
      ...form,
      questions: updatedQuestions
    });
  };
  
  // Handle programmatic question value changes
  const handleQuestionValueChange = (index: number, name: string, value: string | number | boolean) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [name]: value
    };
    setForm({
      ...form,
      questions: updatedQuestions
    });
  };

  // Handle question type change
  const handleQuestionTypeChange = (index: number, type: QuestionType) => {
    const updatedQuestions = [...form.questions];
    
    // Start with the existing question data
    const updatedQuestion = {
      ...updatedQuestions[index],
      type,
    };
    
    // Initialize type-specific properties based on the new question type
    switch (type) {
      case QuestionType.TEXT:
        // Reset any type-specific properties
        delete updatedQuestion.wordLimit;
        delete updatedQuestion.options;
        delete updatedQuestion.minRating;
        delete updatedQuestion.maxRating;
        delete updatedQuestion.defaultRating;
        delete updatedQuestion.dateFormat;
        delete updatedQuestion.minDate;
        delete updatedQuestion.maxDate;
        break;
        
      case QuestionType.TEXT_WITH_LIMIT:
        // Set default word limit
        updatedQuestion.wordLimit = updatedQuestion.wordLimit || 100;
        delete updatedQuestion.options;
        delete updatedQuestion.minRating;
        delete updatedQuestion.maxRating;
        delete updatedQuestion.defaultRating;
        delete updatedQuestion.dateFormat;
        delete updatedQuestion.minDate;
        delete updatedQuestion.maxDate;
        break;
        
      case QuestionType.SINGLE_SELECT:
      case QuestionType.MULTIPLE_CHOICE:
        // Initialize options if not already present or empty
        updatedQuestion.options = updatedQuestion.options?.length ? 
          updatedQuestion.options : 
          [{ text: '' }, { text: '' }];
        delete updatedQuestion.wordLimit;
        delete updatedQuestion.minRating;
        delete updatedQuestion.maxRating;
        delete updatedQuestion.defaultRating;
        delete updatedQuestion.dateFormat;
        delete updatedQuestion.minDate;
        delete updatedQuestion.maxDate;
        break;
        
      case QuestionType.MULTI_SELECT:
        // Initialize options if not already present or empty
        updatedQuestion.options = updatedQuestion.options?.length ? 
          updatedQuestion.options : 
          [{ text: '' }, { text: '' }, { text: '' }];
        delete updatedQuestion.wordLimit;
        delete updatedQuestion.minRating;
        delete updatedQuestion.maxRating;
        delete updatedQuestion.defaultRating;
        delete updatedQuestion.dateFormat;
        delete updatedQuestion.minDate;
        delete updatedQuestion.maxDate;
        break;
        
      case QuestionType.RATING_SCALE:
        // Set default rating scale properties
        updatedQuestion.minRating = updatedQuestion.minRating || 1;
        updatedQuestion.maxRating = updatedQuestion.maxRating || 5;
        updatedQuestion.defaultRating = updatedQuestion.defaultRating || 3;
        delete updatedQuestion.options;
        delete updatedQuestion.wordLimit;
        delete updatedQuestion.dateFormat;
        delete updatedQuestion.minDate;
        delete updatedQuestion.maxDate;
        break;
        
      case QuestionType.DATE:
        // Set default date properties
        updatedQuestion.dateFormat = updatedQuestion.dateFormat || 'YYYY-MM-DD';
        delete updatedQuestion.options;
        delete updatedQuestion.wordLimit;
        delete updatedQuestion.minRating;
        delete updatedQuestion.maxRating;
        delete updatedQuestion.defaultRating;
        break;
    }
    
    updatedQuestions[index] = updatedQuestion;
    
    setForm({
      ...form,
      questions: updatedQuestions
    });
  };

  // Handle question required toggle
  const handleRequiredToggle = (index: number) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      required: !updatedQuestions[index].required
    };
    setForm({
      ...form,
      questions: updatedQuestions
    });
  };

  // Handle option text change
  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...form.questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options![optionIndex] = {
        ...updatedQuestions[questionIndex].options![optionIndex],
        text: value
      };
      setForm({
        ...form,
        questions: updatedQuestions
      });
    }
  };

  // Add a new option to a multiple choice question
  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...form.questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options!.push({ text: '' });
      setForm({
        ...form,
        questions: updatedQuestions
      });
    }
  };

  // Remove an option from a multiple choice question
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...form.questions];
    if (updatedQuestions[questionIndex].options && updatedQuestions[questionIndex].options!.length > 2) {
      updatedQuestions[questionIndex].options!.splice(optionIndex, 1);
      setForm({
        ...form,
        questions: updatedQuestions
      });
    }
  };

  // Add a new question
  const addQuestion = () => {
    setForm({
      ...form,
      questions: [
        ...form.questions,
        {
          text: '',
          type: QuestionType.TEXT,
          required: false,
          options: []
        }
      ]
    });
  };

  // Remove a question
  const removeQuestion = (index: number) => {
    if (form.questions.length > 1) {
      const updatedQuestions = [...form.questions];
      updatedQuestions.splice(index, 1);
      setForm({
        ...form,
        questions: updatedQuestions
      });
    }
  };

  // Handle questions reordering
  const handleQuestionsReorder = (reorderedQuestions: Question[]) => {
    setForm({
      ...form,
      questions: reorderedQuestions
    });
  };
  
  // Render the content of a question (used by DraggableQuestionList)
  const renderQuestionContent = (question: Question, questionIndex: number) => {
    return (
      <div className="space-y-4">
        <div className="space-y-4">
          <div>
            <label htmlFor={`question-${questionIndex}`} className="form-label">Question Text <span className="text-red-500">*</span></label>
            <input
              type="text"
              id={`question-${questionIndex}`}
              name="text"
              value={question.text}
              onChange={(e) => handleQuestionChange(questionIndex, e)}
              className="form-input"
              placeholder="Enter question text"
              required
            />
          </div>
          
          <div>
            <label htmlFor={`question-${questionIndex}-description`} className="form-label">Description / Help Text</label>
            <textarea
              id={`question-${questionIndex}-description`}
              name="description"
              value={question.description || ''}
              onChange={(e) => handleQuestionChange(questionIndex, e)}
              className="form-input"
              placeholder="Optional help text or instructions for this question"
              rows={2}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div>
            <label className="form-label">Question Type</label>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Text Input Types */}
              <label className="inline-flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  className="form-radio"
                  checked={question.type === QuestionType.TEXT}
                  onChange={() => handleQuestionTypeChange(questionIndex, QuestionType.TEXT)}
                />
                <div className="ml-2">
                  <span className="font-medium">Text</span>
                  <p className="text-xs text-gray-500">Free-form text response</p>
                </div>
              </label>
              
              <label className="inline-flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  className="form-radio"
                  checked={question.type === QuestionType.TEXT_WITH_LIMIT}
                  onChange={() => handleQuestionTypeChange(questionIndex, QuestionType.TEXT_WITH_LIMIT)}
                />
                <div className="ml-2">
                  <span className="font-medium">Text with Limit</span>
                  <p className="text-xs text-gray-500">Text with word limit</p>
                </div>
              </label>
              
              {/* Choice Types */}
              <label className="inline-flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  className="form-radio"
                  checked={question.type === QuestionType.SINGLE_SELECT}
                  onChange={() => handleQuestionTypeChange(questionIndex, QuestionType.SINGLE_SELECT)}
                />
                <div className="ml-2">
                  <span className="font-medium">Single Select</span>
                  <p className="text-xs text-gray-500">Radio buttons, one choice only</p>
                </div>
              </label>
              
              <label className="inline-flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  className="form-radio"
                  checked={question.type === QuestionType.MULTIPLE_CHOICE}
                  onChange={() => handleQuestionTypeChange(questionIndex, QuestionType.MULTIPLE_CHOICE)}
                />
                <div className="ml-2">
                  <span className="font-medium">Multiple Choice</span>
                  <p className="text-xs text-gray-500">Dropdown, one choice only</p>
                </div>
              </label>
              
              <label className="inline-flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  className="form-radio"
                  checked={question.type === QuestionType.MULTI_SELECT}
                  onChange={() => handleQuestionTypeChange(questionIndex, QuestionType.MULTI_SELECT)}
                />
                <div className="ml-2">
                  <span className="font-medium">Multi-Select</span>
                  <p className="text-xs text-gray-500">Checkboxes, multiple choices</p>
                </div>
              </label>
              
              {/* Other Types */}
              <label className="inline-flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  className="form-radio"
                  checked={question.type === QuestionType.RATING_SCALE}
                  onChange={() => handleQuestionTypeChange(questionIndex, QuestionType.RATING_SCALE)}
                />
                <div className="ml-2">
                  <span className="font-medium">Rating Scale</span>
                  <p className="text-xs text-gray-500">Numeric rating</p>
                </div>
              </label>
              
              <label className="inline-flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="radio"
                  className="form-radio"
                  checked={question.type === QuestionType.DATE}
                  onChange={() => handleQuestionTypeChange(questionIndex, QuestionType.DATE)}
                />
                <div className="ml-2">
                  <span className="font-medium">Date</span>
                  <p className="text-xs text-gray-500">Date selection</p>
                </div>
              </label>
            </div>
          </div>
          
          <div>
            <label className="form-label">Required</label>
            <div className="mt-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={question.required}
                  onChange={() => handleRequiredToggle(questionIndex)}
                />
                <span className="ml-2">Make this question required</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Type-specific properties */}
        
        {/* Text with Limit */}
        {question.type === QuestionType.TEXT_WITH_LIMIT && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <label className="form-label">Word Limit</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="wordLimit"
                value={question.wordLimit || 100}
                onChange={(e) => handleQuestionValueChange(questionIndex, 'wordLimit', parseInt(e.target.value) || 0)}
                className="form-input w-24"
                min="1"
                max="1000"
              />
              <span className="text-sm text-gray-500">Maximum number of words allowed</span>
            </div>
          </div>
        )}
        
        {/* Rating Scale */}
        {question.type === QuestionType.RATING_SCALE && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Rating Scale Properties</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Minimum Rating</label>
                <input
                  type="number"
                  name="minRating"
                  value={question.minRating || 1}
                  onChange={(e) => handleQuestionValueChange(questionIndex, 'minRating', parseInt(e.target.value) || 1)}
                  className="form-input"
                  min="0"
                  max="9"
                />
              </div>
              
              <div>
                <label className="form-label">Maximum Rating</label>
                <input
                  type="number"
                  name="maxRating"
                  value={question.maxRating || 5}
                  onChange={(e) => handleQuestionValueChange(questionIndex, 'maxRating', parseInt(e.target.value) || 5)}
                  className="form-input"
                  min="2"
                  max="10"
                />
              </div>
              
              <div>
                <label className="form-label">Default Rating</label>
                <input
                  type="number"
                  name="defaultRating"
                  value={question.defaultRating || 3}
                  onChange={(e) => handleQuestionValueChange(questionIndex, 'defaultRating', parseInt(e.target.value) || 3)}
                  className="form-input"
                  min={String(question.minRating || 1)}
                  max={String(question.maxRating || 5)}
                />
              </div>
            </div>
            
            <div className="mt-2">
              <label className="form-label">Preview</label>
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
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Date */}
        {question.type === QuestionType.DATE && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <h4 className="text-sm font-medium text-gray-700">Date Properties</h4>
            
            <div>
              <label className="form-label">Date Format</label>
              <select
                name="dateFormat"
                value={question.dateFormat || 'YYYY-MM-DD'}
                onChange={(e) => handleQuestionValueChange(questionIndex, 'dateFormat', e.target.value)}
                className="form-input"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY/MM/DD">YYYY/MM/DD</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Minimum Date (Optional)</label>
                <input
                  type="date"
                  name="minDate"
                  value={question.minDate || ''}
                  onChange={(e) => handleQuestionValueChange(questionIndex, 'minDate', e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div>
                <label className="form-label">Maximum Date (Optional)</label>
                <input
                  type="date"
                  name="maxDate"
                  value={question.maxDate || ''}
                  onChange={(e) => handleQuestionValueChange(questionIndex, 'maxDate', e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Options for Choice Questions */}
        {(question.type === QuestionType.MULTIPLE_CHOICE || 
          question.type === QuestionType.SINGLE_SELECT || 
          question.type === QuestionType.MULTI_SELECT) && 
         question.options && (
          <div className="mt-4 space-y-3">
            <label className="form-label">
              Options
              {question.type === QuestionType.MULTI_SELECT && 
                <span className="ml-2 text-sm text-gray-500">(Users can select multiple)</span>
              }
            </label>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <div className="w-8 flex-shrink-0 flex items-center justify-center">
                  {question.type === QuestionType.SINGLE_SELECT && (
                    <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                  )}
                  {question.type === QuestionType.MULTIPLE_CHOICE && (
                    <div className="text-xs text-gray-500">{optionIndex + 1}.</div>
                  )}
                  {question.type === QuestionType.MULTI_SELECT && (
                    <div className="h-4 w-4 rounded border border-gray-300"></div>
                  )}
                </div>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(questionIndex, optionIndex, e.target.value)}
                  className="form-input"
                  placeholder={`Option ${optionIndex + 1}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => removeOption(questionIndex, optionIndex)}
                  disabled={question.options!.length <= 2}
                  className={`p-1 rounded-full ${question.options!.length <= 2 ? 'text-gray-300' : 'text-red-500 hover:bg-red-100'}`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(questionIndex)}
              className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Option
            </button>
          </div>
        )}
      </div>
    );
  };

  // Submit the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!form.title.trim()) {
      setError('Form title is required');
      setLoading(false);
      return;
    }

    // Validate questions
    for (let i = 0; i < form.questions.length; i++) {
      const question = form.questions[i];
      const questionNumber = i + 1;
      
      // Validate question text
      if (!question.text.trim()) {
        setError(`Question ${questionNumber} text is required`);
        setLoading(false);
        return;
      }

      // Type-specific validation
      switch (question.type) {
        case QuestionType.TEXT_WITH_LIMIT:
          // Validate word limit
          if (!question.wordLimit || question.wordLimit <= 0 || question.wordLimit > 1000) {
            setError(`Question ${questionNumber}: Word limit must be between 1 and 1000`);
            setLoading(false);
            return;
          }
          break;
          
        case QuestionType.SINGLE_SELECT:
        case QuestionType.MULTIPLE_CHOICE:
        case QuestionType.MULTI_SELECT:
          // Validate options
          if (!question.options || question.options.length < 2) {
            setError(`Question ${questionNumber}: At least 2 options are required`);
            setLoading(false);
            return;
          }
          
          // Validate each option has text
          for (let j = 0; j < question.options.length; j++) {
            if (!question.options[j].text.trim()) {
              setError(`Question ${questionNumber}, Option ${j + 1}: Option text is required`);
              setLoading(false);
              return;
            }
          }
          break;
          
        case QuestionType.RATING_SCALE:
          // Validate min rating
          if (question.minRating === undefined || question.minRating < 0 || question.minRating > 9) {
            setError(`Question ${questionNumber}: Minimum rating must be between 0 and 9`);
            setLoading(false);
            return;
          }
          
          // Validate max rating
          if (question.maxRating === undefined || question.maxRating <= question.minRating || question.maxRating > 10) {
            setError(`Question ${questionNumber}: Maximum rating must be greater than minimum rating and at most 10`);
            setLoading(false);
            return;
          }
          
          // Validate default rating
          if (question.defaultRating === undefined || 
              question.defaultRating < question.minRating || 
              question.defaultRating > question.maxRating) {
            setError(`Question ${questionNumber}: Default rating must be between minimum and maximum rating`);
            setLoading(false);
            return;
          }
          break;
          
        case QuestionType.DATE:
          // Validate date format
          if (!question.dateFormat) {
            setError(`Question ${questionNumber}: Date format is required`);
            setLoading(false);
            return;
          }
          
          // Validate min/max date if both are provided
          if (question.minDate && question.maxDate) {
            const minDate = new Date(question.minDate);
            const maxDate = new Date(question.maxDate);
            
            if (minDate > maxDate) {
              setError(`Question ${questionNumber}: Minimum date cannot be after maximum date`);
              setLoading(false);
              return;
            }
          }
          break;
      }
    }

    try {
      const createdForm = await formService.createForm(form);
      navigate(`/forms/${createdForm.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create form. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow-soft rounded-lg overflow-hidden">
              <div className="px-6 py-8 bg-gradient-to-r from-primary-500 to-secondary-500 sm:p-10 sm:pb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl leading-6 font-bold text-white">Create Feedback Form</h2>
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

                <form onSubmit={handleSubmit}>
                  <div className="space-y-8">
                    {/* Form Title and Description */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="form-label">Form Title <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={form.title}
                          onChange={handleFormChange}
                          className="form-input"
                          placeholder="Enter form title"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="description" className="form-label">Description (optional)</label>
                        <textarea
                          id="description"
                          name="description"
                          value={form.description || ''}
                          onChange={handleFormChange}
                          className="form-input"
                          placeholder="Enter form description"
                          rows={3}
                        ></textarea>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                      
                      <DraggableQuestionList
                        questions={form.questions}
                        onQuestionsReorder={handleQuestionsReorder}
                        onQuestionRemove={removeQuestion}
                        renderQuestionContent={renderQuestionContent}
                      />
                      
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="w-full flex justify-center items-center px-4 py-3 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Add Question
                      </button>
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                      <FormPreviewButton form={form} />
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                      >
                        {loading ? 'Creating...' : 'Create Form'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateForm;