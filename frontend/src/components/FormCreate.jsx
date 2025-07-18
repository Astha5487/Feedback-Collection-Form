import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import formService from '../services/form.service';
import { useTheme } from '../context/ThemeContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const FormCreate = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    questions: []
  });

  // For new question being added
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'TEXT',
    required: false,
    options: [],
    wordLimit: null,
    placeholder: ''
  });

  // For new option being added to a multiple choice question
  const [newOption, setNewOption] = useState('');

  // For active question editing
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleQuestionChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewQuestion({
      ...newQuestion,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addOption = () => {
    if (newOption.trim() === '') return;

    setNewQuestion({
      ...newQuestion,
      options: [
        ...newQuestion.options,
        { text: newOption, displayOrder: newQuestion.options.length }
      ]
    });
    setNewOption('');
  };

  const removeOption = (index) => {
    setNewQuestion({
      ...newQuestion,
      options: newQuestion.options.filter((_, i) => i !== index)
    });
  };

  const addQuestion = () => {
    if (newQuestion.text.trim() === '') return;

    // Validate that multiple choice questions have options
    if (newQuestion.type === 'MULTIPLE_CHOICE' && newQuestion.options.length === 0) {
      setError('Multiple choice questions must have at least one option.');
      return;
    }

    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          ...newQuestion,
          displayOrder: formData.questions.length
        }
      ]
    });

    // Reset new question form
    setNewQuestion({
      text: '',
      type: 'TEXT',
      required: false,
      options: [],
      wordLimit: null
    });
    setError('');
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  // Handle drag and drop reordering of questions
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(formData.questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display order for all questions
    const updatedItems = items.map((item, index) => ({
      ...item,
      displayOrder: index
    }));

    setFormData({
      ...formData,
      questions: updatedItems
    });
  };

  // Edit an existing question
  const editQuestion = (index) => {
    setActiveQuestionIndex(index);
    setNewQuestion({...formData.questions[index]});
  };

  // Update an existing question
  const updateQuestion = () => {
    if (activeQuestionIndex === null) return;

    // Validate that multiple choice questions have options
    if (newQuestion.type === 'MULTIPLE_CHOICE' && newQuestion.options.length === 0) {
      setError('Multiple choice questions must have at least one option.');
      return;
    }

    const updatedQuestions = [...formData.questions];
    updatedQuestions[activeQuestionIndex] = {...newQuestion};

    setFormData({
      ...formData,
      questions: updatedQuestions
    });

    // Reset form
    setNewQuestion({
      text: '',
      type: 'TEXT',
      required: false,
      options: [],
      wordLimit: null,
      placeholder: ''
    });
    setActiveQuestionIndex(null);
    setError('');
  };

  // Cancel editing a question
  const cancelEdit = () => {
    setActiveQuestionIndex(null);
    setNewQuestion({
      text: '',
      type: 'TEXT',
      required: false,
      options: [],
      wordLimit: null,
      placeholder: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.title.trim() === '') {
      setError('Form title is required.');
      return;
    }

    if (formData.questions.length === 0) {
      setError('Form must have at least one question.');
      return;
    }

    setLoading(true);
    setError('');

    formService.createForm(formData)
      .then(response => {
        setLoading(false);
        navigate(`/forms/${response.data.id}`);
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

  // Toggle preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Generate a sample response for preview
  const generateSampleResponse = () => {
    return formData.questions.map(question => {
      if (question.type === 'TEXT') {
        return { questionId: question.displayOrder, answer: 'Sample text response' };
      } else if (question.type === 'MULTIPLE_CHOICE') {
        return { 
          questionId: question.displayOrder, 
          answer: question.options.length > 0 ? question.options[0].text : 'No option selected' 
        };
      } else if (question.type === 'RATING') {
        return { questionId: question.displayOrder, answer: '4' };
      } else if (question.type === 'DATE') {
        return { questionId: question.displayOrder, answer: new Date().toISOString().split('T')[0] };
      } else if (question.type === 'EMAIL') {
        return { questionId: question.displayOrder, answer: 'user@example.com' };
      } else if (question.type === 'NUMBER') {
        return { questionId: question.displayOrder, answer: '42' };
      } else if (question.type === 'CHECKBOX') {
        return { 
          questionId: question.displayOrder, 
          answer: question.options.slice(0, 2).map(opt => opt.text).join(', ') 
        };
      }
      return { questionId: question.displayOrder, answer: '' };
    });
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            {showPreview ? 'Form Preview' : 'Create New Form'}
          </h1>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={togglePreview}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {showPreview ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Edit Form
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Preview Form
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-md relative mb-6 shadow-md animate-fade-in" role="alert">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="block sm:inline font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!showPreview ? (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
              <div className="mb-5">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Form Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Enter a descriptive title for your form"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md transition-colors duration-200"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  A clear title helps respondents understand the purpose of your form
                </p>
              </div>
              <div className="mb-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Provide additional context or instructions for your form"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md transition-colors duration-200"
                ></textarea>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Optional: Add details to help respondents understand what information you're collecting and why
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-all duration-300">
              <div className="mb-5">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{formData.title || 'Untitled Form'}</h2>
                {formData.description && (
                  <p className="text-gray-600 dark:text-gray-300">{formData.description}</p>
                )}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Questions
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formData.questions.length} question{formData.questions.length !== 1 ? 's' : ''}
              </div>
            </div>

            {showPreview ? (
              // Preview mode for questions
              <div className="space-y-4">
                {formData.questions.length > 0 ? (
                  formData.questions.map((question, index) => (
                    <div key={index} className="question-container animate-fade-in">
                      <p className="question-text">
                        {index + 1}. {question.text} {question.required && <span className="required-indicator">*</span>}
                      </p>
                      <div className="mt-2">
                        {question.type === 'TEXT' && (
                          <textarea 
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder={question.placeholder || "Type your answer here..."}
                            disabled
                            rows="2"
                          ></textarea>
                        )}
                        {question.type === 'MULTIPLE_CHOICE' && (
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <input
                                  type="radio"
                                  name={`question-${index}`}
                                  disabled
                                  className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600"
                                />
                                <label className="ml-2 text-gray-700 dark:text-gray-300">
                                  {option.text}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                        {question.type === 'RATING' && (
                          <div className="flex space-x-4">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <div key={rating} className="flex flex-col items-center">
                                <input
                                  type="radio"
                                  name={`question-${index}`}
                                  disabled
                                  className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">{rating}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {question.type === 'DATE' && (
                          <input
                            type="date"
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            disabled
                          />
                        )}
                        {question.type === 'EMAIL' && (
                          <input
                            type="email"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="email@example.com"
                            disabled
                          />
                        )}
                        {question.type === 'NUMBER' && (
                          <input
                            type="number"
                            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            disabled
                          />
                        )}
                        {question.type === 'CHECKBOX' && (
                          <div className="space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <input
                                  type="checkbox"
                                  disabled
                                  className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded"
                                />
                                <label className="ml-2 text-gray-700 dark:text-gray-300">
                                  {option.text}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">No questions added yet.</p>
                  </div>
                )}
              </div>
            ) : (
              // Edit mode for questions with drag and drop
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="questions">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="mb-6"
                    >
                      {formData.questions.length > 0 ? (
                        <ul className="space-y-3">
                          {formData.questions.map((question, index) => (
                            <Draggable key={index} draggableId={`question-${index}`} index={index}>
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
                                    activeQuestionIndex === index ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
                                  }`}
                                >
                                  <div className="p-4">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="flex items-center">
                                          <div {...provided.dragHandleProps} className="mr-2 cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path>
                                            </svg>
                                          </div>
                                          <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                                            {index + 1}
                                          </span>
                                          <p className="text-sm font-medium text-gray-900 dark:text-white flex-1">
                                            {question.text} {question.required && <span className="text-red-500">*</span>}
                                          </p>
                                        </div>
                                        <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400">
                                          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md mr-2 mb-1">
                                            {question.type === 'TEXT' ? 'Text Input' : 
                                             question.type === 'MULTIPLE_CHOICE' ? 'Multiple Choice' : 
                                             question.type === 'RATING' ? 'Rating (1-5)' :
                                             question.type === 'DATE' ? 'Date' :
                                             question.type === 'EMAIL' ? 'Email' :
                                             question.type === 'NUMBER' ? 'Number' :
                                             question.type === 'CHECKBOX' ? 'Checkbox' : 'Unknown'}
                                          </span>
                                          {question.required && (
                                            <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-0.5 rounded-md mr-2 mb-1">
                                              Required
                                            </span>
                                          )}
                                          {question.type === 'TEXT' && question.wordLimit && (
                                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-md mb-1">
                                              Max {question.wordLimit} words
                                            </span>
                                          )}
                                        </div>
                                        {question.type === 'MULTIPLE_CHOICE' && question.options.length > 0 && (
                                          <div className="mt-2">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Options:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {question.options.map((option, optIndex) => (
                                                <span key={optIndex} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                                  {option.text}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex space-x-1 ml-2">
                                        <button
                                          type="button"
                                          onClick={() => editQuestion(index)}
                                          className="p-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                                          title="Edit question"
                                        >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                          </svg>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => removeQuestion(index)}
                                          className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                                          title="Remove question"
                                        >
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ul>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No questions added yet</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding your first question below</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  {activeQuestionIndex !== null ? 'Edit Question' : 'Add New Question'}
                  {activeQuestionIndex !== null && (
                    <span className="ml-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2 py-0.5 rounded-full">
                      #{activeQuestionIndex + 1}
                    </span>
                  )}
                </h3>
                {activeQuestionIndex !== null && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="questionText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Question Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="text"
                    id="questionText"
                    value={newQuestion.text}
                    onChange={handleQuestionChange}
                    placeholder="Enter your question"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md transition-colors duration-200"
                  />
                </div>

                <div>
                  <label htmlFor="questionType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Question Type
                  </label>
                  <select
                    name="type"
                    id="questionType"
                    value={newQuestion.type}
                    onChange={handleQuestionChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-200"
                  >
                    <option value="TEXT">Text Input</option>
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="RATING">Rating (1-5)</option>
                    <option value="DATE">Date</option>
                    <option value="EMAIL">Email</option>
                    <option value="NUMBER">Number</option>
                    <option value="CHECKBOX">Checkbox (Multiple Selection)</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="required"
                      id="questionRequired"
                      checked={newQuestion.required}
                      onChange={handleQuestionChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded transition-colors duration-200"
                    />
                    <label htmlFor="questionRequired" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Required
                    </label>
                  </div>

                  {(newQuestion.type === 'TEXT' || newQuestion.type === 'EMAIL' || newQuestion.type === 'NUMBER') && (
                    <div className="flex-1">
                      <label htmlFor="placeholder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Placeholder Text
                      </label>
                      <input
                        type="text"
                        name="placeholder"
                        id="placeholder"
                        value={newQuestion.placeholder || ''}
                        onChange={handleQuestionChange}
                        placeholder="Enter placeholder text"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md transition-colors duration-200"
                      />
                    </div>
                  )}
                </div>
              </div>

              {newQuestion.type === 'TEXT' && (
                <div className="mb-4">
                  <label htmlFor="wordLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Word Limit (optional)
                  </label>
                  <input
                    type="number"
                    name="wordLimit"
                    id="wordLimit"
                    min="1"
                    value={newQuestion.wordLimit || ''}
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value, 10) : null;
                      setNewQuestion({
                        ...newQuestion,
                        wordLimit: value
                      });
                    }}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md transition-colors duration-200"
                    placeholder="Leave empty for no limit"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Set a maximum number of words for this text answer
                  </p>
                </div>
              )}

              {(newQuestion.type === 'MULTIPLE_CHOICE' || newQuestion.type === 'CHECKBOX') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Options
                  </label>

                  {newQuestion.options.length > 0 && (
                    <div className="mb-3 bg-gray-50 dark:bg-gray-700/50 rounded-md p-3 border border-gray-200 dark:border-gray-600">
                      <ul className="space-y-2">
                        {newQuestion.options.map((option, index) => (
                          <li key={index} className="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 p-2 rounded-md shadow-sm">
                            <div className="flex items-center">
                              <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 text-xs font-medium w-5 h-5 rounded-full flex items-center justify-center mr-2">
                                {index + 1}
                              </span>
                              <span>{option.text}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex">
                    <input
                      type="text"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-l-md sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-200"
                      placeholder="Enter option text"
                    />
                    <button
                      type="button"
                      onClick={addOption}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                      Add Option
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Add at least one option for your {newQuestion.type === 'MULTIPLE_CHOICE' ? 'multiple choice' : 'checkbox'} question
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                {activeQuestionIndex !== null ? (
                  <>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={updateQuestion}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Update Question
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Question
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={togglePreview}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              {showPreview ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Back to Editor
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Preview Form
                </>
              )}
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => navigate('/forms')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                    </svg>
                    Create Form
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Help section */}
        <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Tips for Creating Effective Forms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Best Practices</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                <li>Keep your form concise and focused</li>
                <li>Use clear and specific questions</li>
                <li>Group related questions together</li>
                <li>Make important questions required</li>
                <li>Preview your form before sharing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Question Types</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                <li><span className="font-medium text-indigo-600 dark:text-indigo-400">Text</span>: For open-ended responses</li>
                <li><span className="font-medium text-indigo-600 dark:text-indigo-400">Multiple Choice</span>: For selecting one option</li>
                <li><span className="font-medium text-indigo-600 dark:text-indigo-400">Checkbox</span>: For selecting multiple options</li>
                <li><span className="font-medium text-indigo-600 dark:text-indigo-400">Rating</span>: For collecting satisfaction levels</li>
                <li><span className="font-medium text-indigo-600 dark:text-indigo-400">Date/Email/Number</span>: For specific data formats</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCreate;
