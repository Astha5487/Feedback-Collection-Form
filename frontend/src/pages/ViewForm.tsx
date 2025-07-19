import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import formService, { Form, QuestionType } from '../services/formService';
import responseService, { Response } from '../services/responseService';
import { downloadAllResponsesPdf } from '../utils/pdfGenerator';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';

const ViewForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'table' | 'summary'>('table');

  useEffect(() => {
    const fetchFormAndResponses = async () => {
      if (!id) return;
      
      try {
        const formId = parseInt(id);
        const formData = await formService.getFormById(formId);
        setForm(formData);
        
        const responsesData = await responseService.getResponsesByFormId(formId);
        setResponses(responsesData);
      } catch (err: any) {
        setError('Failed to load form data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFormAndResponses();
  }, [id]);

  const exportToCSV = () => {
    if (!form || !responses.length) return;
    
    // Create headers
    const headers = ['Respondent', 'Timestamp', ...form.questions.map(q => q.text)];
    
    // Create rows
    const rows = responses.map(response => {
      const row = [
        response.respondentName || 'Anonymous',
        new Date(response.createdAt).toLocaleString(),
      ];
      
      // Add answers in the same order as questions
      form.questions.forEach(question => {
        const answer = response.answers.find(a => a.questionId === question.id);
        row.push(answer ? answer.text : '');
      });
      
      return row;
    });
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${form.title}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate summary statistics for each question
  const getSummaryStats = () => {
    if (!form || !responses.length) return [];
    
    return form.questions.map(question => {
      const answers = responses
        .flatMap(r => r.answers)
        .filter(a => a.questionId === question.id);
      
      // Base stats object
      const baseStats = {
        question: question.text,
        type: question.type,
        responseCount: answers.length,
        description: question.description
      };
      
      // Process based on question type
      switch (question.type) {
        case QuestionType.TEXT:
        case QuestionType.TEXT_WITH_LIMIT:
          return {
            ...baseStats,
            // For text questions, show a sample of responses
            sampleResponses: answers
              .slice(0, 5)
              .map(a => a.textValue || a.text || '')
              .filter(text => text.trim() !== '')
          };
          
        case QuestionType.SINGLE_SELECT:
        case QuestionType.MULTIPLE_CHOICE:
          // For single select/multiple choice, count occurrences of each option
          const optionCounts: Record<string, number> = {};
          
          // Initialize all options with 0 count
          if (question.options) {
            question.options.forEach(option => {
              optionCounts[option.text] = 0;
            });
          }
          
          // Count selected options
          answers.forEach(answer => {
            if (answer.selectedOptionId !== undefined) {
              const option = question.options?.find(o => o.id === answer.selectedOptionId);
              if (option) {
                optionCounts[option.text] = (optionCounts[option.text] || 0) + 1;
              }
            } else if (answer.text) {
              // Fallback for backward compatibility
              optionCounts[answer.text] = (optionCounts[answer.text] || 0) + 1;
            }
          });
          
          return {
            ...baseStats,
            optionCounts,
            chartData: optionCounts // For chart components
          };
          
        case QuestionType.MULTI_SELECT:
          // For multi-select, count occurrences of each option
          const multiSelectCounts: Record<string, number> = {};
          
          // Initialize all options with 0 count
          if (question.options) {
            question.options.forEach(option => {
              multiSelectCounts[option.text] = 0;
            });
          }
          
          // Count selected options
          answers.forEach(answer => {
            if (answer.selectedOptionIds && answer.selectedOptionIds.length > 0) {
              answer.selectedOptionIds.forEach(optionId => {
                const option = question.options?.find(o => o.id === optionId);
                if (option) {
                  multiSelectCounts[option.text] = (multiSelectCounts[option.text] || 0) + 1;
                }
              });
            } else if (answer.text) {
              // Fallback for backward compatibility (comma-separated values)
              answer.text.split(',').forEach(text => {
                const trimmedText = text.trim();
                if (trimmedText) {
                  multiSelectCounts[trimmedText] = (multiSelectCounts[trimmedText] || 0) + 1;
                }
              });
            }
          });
          
          return {
            ...baseStats,
            optionCounts: multiSelectCounts,
            chartData: multiSelectCounts // For chart components
          };
          
        case QuestionType.RATING_SCALE:
          // For rating scale, count occurrences of each rating
          const ratingCounts: Record<string, number> = {};
          
          // Initialize all possible ratings with 0 count
          const minRating = question.minRating || 1;
          const maxRating = question.maxRating || 5;
          
          for (let i = minRating; i <= maxRating; i++) {
            ratingCounts[i.toString()] = 0;
          }
          
          // Count ratings
          answers.forEach(answer => {
            if (answer.rating !== undefined) {
              ratingCounts[answer.rating.toString()] = (ratingCounts[answer.rating.toString()] || 0) + 1;
            } else if (answer.text) {
              // Fallback for backward compatibility
              ratingCounts[answer.text] = (ratingCounts[answer.text] || 0) + 1;
            }
          });
          
          return {
            ...baseStats,
            ratingCounts,
            chartData: ratingCounts, // For chart components
            minRating,
            maxRating
          };
          
        case QuestionType.DATE:
          // For date questions, group by month/year
          const dateCounts: Record<string, number> = {};
          const dateValues: string[] = [];
          
          // Extract dates
          answers.forEach(answer => {
            const dateValue = answer.dateValue || answer.text;
            if (dateValue) {
              try {
                const date = new Date(dateValue);
                const monthYear = date.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short' 
                });
                
                dateCounts[monthYear] = (dateCounts[monthYear] || 0) + 1;
                dateValues.push(dateValue);
              } catch (e) {
                console.error('Invalid date:', dateValue);
              }
            }
          });
          
          return {
            ...baseStats,
            dateCounts,
            chartData: dateCounts, // For chart components
            dateValues
          };
          
        default:
          return baseStats;
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg mb-6">
            <p>Form not found or you don't have permission to view it.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const summaryStats = getSummaryStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-4"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
              {form.description && (
                <p className="mt-2 text-gray-600">{form.description}</p>
              )}
            </div>
            
            {responses.length > 0 && (
              <button
                onClick={exportToCSV}
                className="btn btn-secondary mt-4 md:mt-0"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Export to CSV
              </button>
            )}
          </div>

          <div className="bg-white shadow-soft rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Responses ({responses.length})
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveTab('table')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'table'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                  >
                    Table View
                  </button>
                  <button
                    onClick={() => setActiveTab('summary')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${
                      activeTab === 'summary'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                    }`}
                  >
                    Summary View
                  </button>
                </div>
              </div>
            </div>

            {responses.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No responses yet for this form.</p>
                <p className="mt-2 text-sm text-gray-400">
                  Share your form to start collecting feedback.
                </p>
                {form.publicUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Form URL:</p>
                    <div className="flex items-center justify-center">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/form/${form.publicUrl}`}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full max-w-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {activeTab === 'table' ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Respondent
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          {form.questions.map((question) => (
                            <th key={question.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {question.text}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {responses.map((response) => (
                          <tr key={response.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {response.respondentName || 'Anonymous'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(response.createdAt).toLocaleString()}
                            </td>
                            {form.questions.map((question) => {
                              const answer = response.answers.find(a => a.questionId === question.id);
                              return (
                                <td key={question.id} className="px-6 py-4 text-sm text-gray-500">
                                  {answer ? answer.text : '-'}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 space-y-8">
                    {summaryStats.map((stat, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {stat.question}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {stat.responseCount} responses
                        </p>
                        
                        {stat.type === 'MULTIPLE_CHOICE' && stat.optionCounts && (
                          <div className="space-y-3">
                            {Object.entries(stat.optionCounts).map(([option, count], i) => (
                              <div key={i}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-700">{option}</span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {count} ({Math.round((count / stat.responseCount) * 100)}%)
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-primary-500 h-2 rounded-full"
                                    style={{ width: `${(count / stat.responseCount) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {stat.type === 'TEXT' && stat.sampleResponses && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Sample responses:</p>
                            <ul className="space-y-2">
                              {stat.sampleResponses.length > 0 ? (
                                stat.sampleResponses.map((response, i) => (
                                  <li key={i} className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                                    "{response}"
                                  </li>
                                ))
                              ) : (
                                <li className="text-sm text-gray-500 italic">No text responses</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewForm;