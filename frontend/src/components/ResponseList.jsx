import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import formService from '../services/form.service';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ResponseList = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list', 'table', or 'chart'
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    loadFormAndResponses();
  }, [formId]);

  const loadFormAndResponses = async () => {
    setLoading(true);
    try {
      // First get the form details
      const formResponse = await formService.getFormById(formId);
      setForm(formResponse.data);

      // Then get the responses for this form
      const responsesResponse = await formService.getFormResponses(formId);
      setResponses(responsesResponse.data);

      // Prepare chart data if we have responses and form questions
      if (formResponse.data && responsesResponse.data && responsesResponse.data.length > 0) {
        prepareChartData(formResponse.data, responsesResponse.data);
      }

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

  // Function to prepare chart data from responses
  const prepareChartData = (form, responses) => {
    // Only process multiple-choice questions for visualization
    const multipleChoiceQuestions = form.questions.filter(q => q.type === 'MULTIPLE_CHOICE');

    if (multipleChoiceQuestions.length === 0) {
      setChartData(null);
      return;
    }

    // Create chart data for each multiple-choice question
    const chartDatasets = multipleChoiceQuestions.map(question => {
      // Get all options for this question
      const options = question.options || [];
      const optionLabels = options.map(option => option.text);

      // Count responses for each option
      const optionCounts = options.map(option => {
        return responses.reduce((count, response) => {
          const answer = response.answers.find(a => a.questionId === question.id);
          if (answer && answer.selectedOptionId === option.id) {
            return count + 1;
          }
          return count;
        }, 0);
      });

      // Create chart data for this question
      return {
        questionId: question.id,
        questionText: question.text,
        chartData: {
          labels: optionLabels,
          datasets: [
            {
              label: 'Responses',
              data: optionCounts,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
      };
    });

    setChartData(chartDatasets);
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Responses for {form.title}</h1>
            <p className="text-sm text-gray-500">
              Total responses: {responses.length}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/forms/${formId}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Form
            </Link>
            {responses.length > 0 && (
              <button
                onClick={() => formService.downloadFormResponses(formId)}
                className="inline-flex items-center px-4 py-2 border border-green-300 shadow-sm text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download All Responses
              </button>
            )}
          </div>
        </div>

        {responses.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-center space-x-2 mb-4">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Table View
              </button>
              {chartData && chartData.length > 0 && (
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    viewMode === 'chart'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Chart View
                </button>
              )}
            </div>
          </div>
        )}

        {responses.length === 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
            <p className="text-gray-500">No responses have been submitted for this form yet.</p>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Share this form to collect responses:</p>
              <p className="mt-1 text-sm text-blue-600 break-all">
                {`${window.location.origin}/form/${form.publicUrl}`}
              </p>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/form/${form.publicUrl}`;
                  navigator.clipboard.writeText(url)
                    .then(() => alert('URL copied to clipboard!'))
                    .catch(() => alert('Failed to copy URL'));
                }}
                className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Copy URL
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* List View */}
            {viewMode === 'list' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {responses.map((response) => (
                    <li key={response.id}>
                      <Link 
                        to={`/responses/${response.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-blue-600 truncate">
                                {response.respondentName || 'Anonymous'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {response.respondentEmail || 'No email provided'}
                              </p>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {new Date(response.submittedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {response.answers.length} answers
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Respondent
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted At
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Answers
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {responses.map((response) => (
                        <tr key={response.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {response.respondentName || 'Anonymous'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {response.respondentEmail || 'No email provided'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(response.submittedAt).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {response.answers.length} answers
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Link 
                              to={`/responses/${response.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Chart View */}
            {viewMode === 'chart' && chartData && chartData.length > 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Response Visualization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {chartData.map((chart) => (
                    <div key={chart.questionId} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-4">{chart.questionText}</h4>
                      <div className="h-64">
                        <Bar 
                          data={chart.chartData} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                              title: {
                                display: false,
                              },
                            },
                          }}
                        />
                      </div>
                      <div className="h-64 mt-8">
                        <Pie 
                          data={chart.chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResponseList;
