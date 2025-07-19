import api from './api';

// Types
export enum QuestionType {
  TEXT = 'TEXT',
  TEXT_WITH_LIMIT = 'TEXT_WITH_LIMIT',
  SINGLE_SELECT = 'SINGLE_SELECT',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MULTI_SELECT = 'MULTI_SELECT',
  RATING_SCALE = 'RATING_SCALE',
  DATE = 'DATE'
}

export interface Option {
  id?: number;
  text: string;
  value?: string; // Optional value different from display text
}

export interface Question {
  id?: number;
  text: string;
  description?: string; // Optional description/help text for the question
  type: QuestionType;
  required: boolean;
  options?: Option[]; // For SINGLE_SELECT, MULTIPLE_CHOICE, MULTI_SELECT
  wordLimit?: number; // For TEXT_WITH_LIMIT
  minRating?: number; // For RATING_SCALE
  maxRating?: number; // For RATING_SCALE
  defaultRating?: number; // For RATING_SCALE
  dateFormat?: string; // For DATE (e.g., 'YYYY-MM-DD')
  minDate?: string; // For DATE
  maxDate?: string; // For DATE
}

export interface Form {
  id?: number;
  title: string;
  description?: string;
  questions: Question[];
  publicUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  theme?: string; // Optional theme for the form
  allowAnonymous?: boolean; // Whether to allow anonymous submissions
  showProgressBar?: boolean; // Whether to show a progress bar
  confirmationMessage?: string; // Custom message to show after submission
}

export interface Answer {
  questionId: number;
  textValue?: string; // For TEXT and TEXT_WITH_LIMIT
  selectedOptionId?: number; // For SINGLE_SELECT
  selectedOptionIds?: number[]; // For MULTI_SELECT
  rating?: number; // For RATING_SCALE
  dateValue?: string; // For DATE
}

export interface FormResponse {
  id?: number;
  formId: number;
  answers: Answer[];
  submittedAt?: string;
}

// Form service
const formService = {
  // Create a new form
  createForm: async (form: Form) => {
    const response = await api.post<Form>('/forms', form);
    return response.data;
  },

  // Get all forms for the authenticated user
  getAllForms: async () => {
    const response = await api.get<Form[]>('/forms');
    return response.data;
  },

  // Get a form by ID (for authenticated users)
  getFormById: async (id: number) => {
    const response = await api.get<Form>(`/forms/${id}`);
    return response.data;
  },

  // Get a form by public URL (for public access)
  getFormByPublicUrl: async (publicUrl: string) => {
    const response = await api.get<Form>(`/forms/public/${publicUrl}`);
    return response.data;
  },

  // Delete a form
  deleteForm: async (id: number) => {
    const response = await api.delete(`/forms/${id}`);
    return response.data;
  },

  // Submit a response to a form
  submitResponse: async (formResponse: FormResponse) => {
    const response = await api.post('/responses', formResponse);
    return response.data;
  },

  // Get all responses for a form
  getResponsesByFormId: async (formId: number) => {
    const response = await api.get<FormResponse[]>(`/responses/form/${formId}`);
    return response.data;
  }
};

export default formService;