import api from './api';

// Types
export interface Answer {
  questionId: number;
  text: string;
}

export interface Response {
  id?: number;
  formId: number;
  respondentName?: string;
  answers: Answer[];
  createdAt?: string;
}

// Response service
const responseService = {
  // Submit a response to a form
  submitResponse: async (response: {
    formId: number;
    respondentName?: string;
    answers: Answer[];
  }) => {
    // Get the form to find its publicUrl
    const formResult = await api.get(`/forms/${response.formId}`);
    const publicUrl = formResult.data.publicUrl;
    
    // Submit the response using the publicUrl
    const result = await api.post<Response>(`/forms/public/${publicUrl}/submit`, {
      respondentName: response.respondentName,
      answers: response.answers
    });
    return result.data;
  },

  // Get all responses for a form
  getResponsesByFormId: async (formId: number) => {
    const result = await api.get<Response[]>(`/forms/${formId}/responses`);
    return result.data;
  }
};

export default responseService;