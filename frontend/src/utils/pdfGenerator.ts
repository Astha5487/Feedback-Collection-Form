import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Form, Question } from '../services/formService';
import { Response, Answer } from '../services/responseService';

export const downloadResponsePdf = (
    form: Form,
    response: Response,
    questions: Question[]
) => {
  const pdf = new jsPDF();
  pdf.setFontSize(18);
  pdf.text(form.name, 14, 22);
  pdf.setFontSize(12);
  pdf.text(`Respondent: ${response.respondentName || 'Anonymous'}`, 14, 32);
  pdf.text(`Submitted on: ${new Date(response.createdAt).toLocaleString()}`, 14, 40);

  const data = response.answers.map((answer: Answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    const questionText = question ? question.text : 'Unknown Question';
    return [questionText, answer.text || ''];
  });

  autoTable(pdf, {
    startY: 50,
    head: [['Question', 'Answer']],
    body: data,
  });

  const totalPages = pdf.getNumberOfPages();
  const pageSize = pdf.internal.pageSize;
  const pageWidth = pageSize.width;
  const pageHeight = pageSize.height;

  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10);
  }

  pdf.save(`response_${response.id}.pdf`);
};

export const downloadAllResponsesPdf = (
    form: Form,
    responses: Response[],
    questions: Question[]
) => {
  const pdf = new jsPDF();
  pdf.setFontSize(18);
  pdf.text(`All Responses - ${form.name}`, 14, 22);

  responses.forEach((response, index) => {
    if (index !== 0) pdf.addPage();

    pdf.setFontSize(14);
    pdf.text(`Respondent: ${response.respondentName || 'Anonymous'}`, 14, 32);
    pdf.setFontSize(12);
    pdf.text(`Submitted on: ${new Date(response.createdAt).toLocaleString()}`, 14, 40);

    const data = response.answers.map((answer: Answer) => {
      const question = questions.find(q => q.id === answer.questionId);
      const questionText = question ? question.text : 'Unknown Question';
      return [questionText, answer.text || ''];
    });

    autoTable(pdf, {
      startY: 50,
      head: [['Question', 'Answer']],
      body: data,
    });
  });

  const totalPages = pdf.getNumberOfPages();
  const pageSize = pdf.internal.pageSize;
  const pageWidth = pageSize.width;
  const pageHeight = pageSize.height;

  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10);
  }

  pdf.save(`all_responses.pdf`);
};
