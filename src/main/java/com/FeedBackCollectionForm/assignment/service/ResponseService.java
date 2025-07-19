package com.FeedBackCollectionForm.assignment.service;

import com.FeedBackCollectionForm.assignment.model.*;
import com.FeedBackCollectionForm.assignment.payload.request.AnswerRequest;
import com.FeedBackCollectionForm.assignment.payload.request.ResponseRequest;
import com.FeedBackCollectionForm.assignment.payload.response.ResponseResponse;
import com.FeedBackCollectionForm.assignment.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResponseService {

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Transactional
    public ResponseResponse submitResponse(String publicUrl, ResponseRequest responseRequest) {
        Form form = formRepository.findByPublicUrl(publicUrl)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        Response response = new Response();
        response.setForm(form);
        response.setRespondentName(responseRequest.getRespondentName());
        response.setRespondentEmail(responseRequest.getRespondentEmail());

        Response savedResponse = responseRepository.save(response);

        // Process answers
        for (AnswerRequest answerRequest : responseRequest.getAnswers()) {
            Question question = questionRepository.findById(answerRequest.getQuestionId())
                    .orElseThrow(() -> new RuntimeException("Question not found"));

            if (!question.getForm().getId().equals(form.getId())) {
                throw new RuntimeException("Question does not belong to this form");
            }

            Answer answer = new Answer();
            answer.setResponse(savedResponse);
            answer.setQuestion(question);

            if (question.getType() == QuestionType.TEXT || question.getType() == QuestionType.TEXT_WITH_LIMIT) {
                answer.setTextAnswer(answerRequest.getTextAnswer());

                // Check word limit if set
                if (question.getWordLimit() != null && question.getWordLimit() > 0 && answerRequest.getTextAnswer() != null) {
                    String[] words = answerRequest.getTextAnswer().trim().split("\\s+");
                    if (words.length > question.getWordLimit()) {
                        throw new RuntimeException("Answer exceeds word limit of " + question.getWordLimit() + " words");
                    }
                }
            } else if (question.getType() == QuestionType.MULTIPLE_CHOICE || question.getType() == QuestionType.SINGLE_SELECT) {
                if (answerRequest.getSelectedOptionId() != null) {
                    Option option = optionRepository.findById(answerRequest.getSelectedOptionId())
                            .orElseThrow(() -> new RuntimeException("Option not found"));

                    if (!option.getQuestion().getId().equals(question.getId())) {
                        throw new RuntimeException("Option does not belong to this question");
                    }

                    answer.setSelectedOption(option);
                }
            } else if (question.getType() == QuestionType.MULTI_SELECT) {
                if (answerRequest.getSelectedOptionIds() != null && !answerRequest.getSelectedOptionIds().isEmpty()) {
                    for (Long optionId : answerRequest.getSelectedOptionIds()) {
                        Option option = optionRepository.findById(optionId)
                                .orElseThrow(() -> new RuntimeException("Option not found"));

                        if (!option.getQuestion().getId().equals(question.getId())) {
                            throw new RuntimeException("Option does not belong to this question");
                        }

                        answer.addSelectedOption(option);
                    }
                }
            } else if (question.getType() == QuestionType.RATING_SCALE) {
                if (answerRequest.getRatingValue() != null) {
                    // Validate rating against min/max if set
                    if (question.getMinRating() != null && answerRequest.getRatingValue() < question.getMinRating()) {
                        throw new RuntimeException("Rating value must be at least " + question.getMinRating());
                    }
                    if (question.getMaxRating() != null && answerRequest.getRatingValue() > question.getMaxRating()) {
                        throw new RuntimeException("Rating value must be at most " + question.getMaxRating());
                    }
                    answer.setRatingValue(answerRequest.getRatingValue());
                }
            } else if (question.getType() == QuestionType.DATE) {
                if (answerRequest.getDateValue() != null) {
                    // Validate date against min/max if set
                    if (question.getMinDate() != null && answerRequest.getDateValue().compareTo(question.getMinDate()) < 0) {
                        throw new RuntimeException("Date must be on or after " + question.getMinDate());
                    }
                    if (question.getMaxDate() != null && answerRequest.getDateValue().compareTo(question.getMaxDate()) > 0) {
                        throw new RuntimeException("Date must be on or before " + question.getMaxDate());
                    }
                    answer.setDateValue(answerRequest.getDateValue());
                }
            }

            answerRepository.save(answer);
        }

        return ResponseResponse.fromEntity(savedResponse);
    }

    @Transactional(readOnly = true)
    public List<ResponseResponse> getResponsesByForm(Long formId, String username) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        if (!form.getCreatedBy().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to access this form's responses");
        }

        return responseRepository.findByFormOrderBySubmittedAtDesc(form).stream()
                .map(ResponseResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ResponseResponse getResponseById(Long responseId, String username) {
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found"));

        if (!response.getForm().getCreatedBy().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to access this response");
        }

        return ResponseResponse.fromEntity(response);
    }

    @Transactional(readOnly = true)
    public ResponseResponse getResponseByIdForRespondent(Long responseId, String email) {
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found"));

        if (!response.getRespondentEmail().equals(email)) {
            throw new RuntimeException("Not authorized to access this response");
        }

        return ResponseResponse.fromEntity(response);
    }

    @Transactional(readOnly = true)
    public List<ResponseResponse> getResponsesByEmail(String email) {
        return responseRepository.findByRespondentEmailOrderBySubmittedAtDesc(email).stream()
                .map(ResponseResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Generates a CSV string containing all responses for a form.
     * 
     * @param formId The ID of the form
     * @param username The username of the user requesting the download
     * @return A CSV string containing all responses
     */
    @Transactional(readOnly = true)
    public String generateCsvForForm(Long formId, String username) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        if (!form.getCreatedBy().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to access this form's responses");
        }

        List<Response> responses = responseRepository.findByFormOrderBySubmittedAtDesc(form);

        // Build CSV header
        StringBuilder csv = new StringBuilder();
        csv.append("Response ID,Respondent Name,Respondent Email,Submission Date");

        // Add question headers
        List<Question> questions = form.getQuestions();
        for (Question question : questions) {
            csv.append(",").append("\"").append(question.getText().replace("\"", "\"\"")).append("\"");
        }
        csv.append("\n");

        // Add response data
        for (Response response : responses) {
            csv.append(response.getId()).append(",");
            csv.append("\"").append(response.getRespondentName() != null ? response.getRespondentName().replace("\"", "\"\"") : "").append("\",");
            csv.append("\"").append(response.getRespondentEmail() != null ? response.getRespondentEmail().replace("\"", "\"\"") : "").append("\",");
            csv.append("\"").append(response.getSubmittedAt()).append("\"");

            // Add answers
            for (Question question : questions) {
                csv.append(",");

                // Find the answer for this question
                Optional<Answer> answerOpt = response.getAnswers().stream()
                        .filter(a -> a.getQuestion().getId().equals(question.getId()))
                        .findFirst();

                if (answerOpt.isPresent()) {
                    Answer answer = answerOpt.get();
                    if (question.getType() == QuestionType.TEXT || question.getType() == QuestionType.TEXT_WITH_LIMIT) {
                        csv.append("\"").append(answer.getTextAnswer() != null ? answer.getTextAnswer().replace("\"", "\"\"") : "").append("\"");
                    } else if (question.getType() == QuestionType.MULTIPLE_CHOICE || question.getType() == QuestionType.SINGLE_SELECT) {
                        if (answer.getSelectedOption() != null) {
                            csv.append("\"").append(answer.getSelectedOption().getText().replace("\"", "\"\"")).append("\"");
                        }
                    } else if (question.getType() == QuestionType.MULTI_SELECT) {
                        if (answer.getSelectedOptions() != null && !answer.getSelectedOptions().isEmpty()) {
                            String optionsText = answer.getSelectedOptions().stream()
                                .map(option -> option.getText())
                                .collect(java.util.stream.Collectors.joining(", "));
                            csv.append("\"").append(optionsText.replace("\"", "\"\"")).append("\"");
                        }
                    } else if (question.getType() == QuestionType.RATING_SCALE) {
                        if (answer.getRatingValue() != null) {
                            csv.append(answer.getRatingValue());
                        }
                    } else if (question.getType() == QuestionType.DATE) {
                        if (answer.getDateValue() != null) {
                            csv.append("\"").append(answer.getDateValue().replace("\"", "\"\"")).append("\"");
                        }
                    }
                }
            }
            csv.append("\n");
        }

        return csv.toString();
    }

    /**
     * Generates a CSV string for a single response.
     * 
     * @param responseId The ID of the response
     * @param username The username of the user requesting the download
     * @return A CSV string containing the response
     */
    @Transactional(readOnly = true)
    public String generateCsvForResponse(Long responseId, String username) {
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found"));

        if (!response.getForm().getCreatedBy().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to access this response");
        }

        // Build CSV header
        StringBuilder csv = new StringBuilder();
        csv.append("Response ID,Respondent Name,Respondent Email,Submission Date");

        // Add question headers
        List<Question> questions = response.getForm().getQuestions();
        for (Question question : questions) {
            csv.append(",").append("\"").append(question.getText().replace("\"", "\"\"")).append("\"");
        }
        csv.append("\n");

        // Add response data
        csv.append(response.getId()).append(",");
        csv.append("\"").append(response.getRespondentName() != null ? response.getRespondentName().replace("\"", "\"\"") : "").append("\",");
        csv.append("\"").append(response.getRespondentEmail() != null ? response.getRespondentEmail().replace("\"", "\"\"") : "").append("\",");
        csv.append("\"").append(response.getSubmittedAt()).append("\"");

        // Add answers
        for (Question question : questions) {
            csv.append(",");

            // Find the answer for this question
            Optional<Answer> answerOpt = response.getAnswers().stream()
                    .filter(a -> a.getQuestion().getId().equals(question.getId()))
                    .findFirst();

            if (answerOpt.isPresent()) {
                Answer answer = answerOpt.get();
                if (question.getType() == QuestionType.TEXT || question.getType() == QuestionType.TEXT_WITH_LIMIT) {
                    csv.append("\"").append(answer.getTextAnswer() != null ? answer.getTextAnswer().replace("\"", "\"\"") : "").append("\"");
                } else if (question.getType() == QuestionType.MULTIPLE_CHOICE || question.getType() == QuestionType.SINGLE_SELECT) {
                    if (answer.getSelectedOption() != null) {
                        csv.append("\"").append(answer.getSelectedOption().getText().replace("\"", "\"\"")).append("\"");
                    }
                } else if (question.getType() == QuestionType.MULTI_SELECT) {
                    if (answer.getSelectedOptions() != null && !answer.getSelectedOptions().isEmpty()) {
                        String optionsText = answer.getSelectedOptions().stream()
                            .map(option -> option.getText())
                            .collect(java.util.stream.Collectors.joining(", "));
                        csv.append("\"").append(optionsText.replace("\"", "\"\"")).append("\"");
                    }
                } else if (question.getType() == QuestionType.RATING_SCALE) {
                    if (answer.getRatingValue() != null) {
                        csv.append(answer.getRatingValue());
                    }
                } else if (question.getType() == QuestionType.DATE) {
                    if (answer.getDateValue() != null) {
                        csv.append("\"").append(answer.getDateValue().replace("\"", "\"\"")).append("\"");
                    }
                }
            }
        }
        csv.append("\n");

        return csv.toString();
    }

    /**
     * Generates a CSV string for a respondent's response.
     * 
     * @param responseId The ID of the response
     * @param email The email of the respondent
     * @return A CSV string containing the response
     */
    @Transactional(readOnly = true)
    public String generateCsvForRespondent(Long responseId, String email) {
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found"));

        if (!response.getRespondentEmail().equals(email)) {
            throw new RuntimeException("Not authorized to access this response");
        }

        // Build CSV header
        StringBuilder csv = new StringBuilder();
        csv.append("Response ID,Respondent Name,Respondent Email,Submission Date");

        // Add question headers
        List<Question> questions = response.getForm().getQuestions();
        for (Question question : questions) {
            csv.append(",").append("\"").append(question.getText().replace("\"", "\"\"")).append("\"");
        }
        csv.append("\n");

        // Add response data
        csv.append(response.getId()).append(",");
        csv.append("\"").append(response.getRespondentName() != null ? response.getRespondentName().replace("\"", "\"\"") : "").append("\",");
        csv.append("\"").append(response.getRespondentEmail() != null ? response.getRespondentEmail().replace("\"", "\"\"") : "").append("\",");
        csv.append("\"").append(response.getSubmittedAt()).append("\"");

        // Add answers
        for (Question question : questions) {
            csv.append(",");

            // Find the answer for this question
            Optional<Answer> answerOpt = response.getAnswers().stream()
                    .filter(a -> a.getQuestion().getId().equals(question.getId()))
                    .findFirst();

            if (answerOpt.isPresent()) {
                Answer answer = answerOpt.get();
                if (question.getType() == QuestionType.TEXT || question.getType() == QuestionType.TEXT_WITH_LIMIT) {
                    csv.append("\"").append(answer.getTextAnswer() != null ? answer.getTextAnswer().replace("\"", "\"\"") : "").append("\"");
                } else if (question.getType() == QuestionType.MULTIPLE_CHOICE || question.getType() == QuestionType.SINGLE_SELECT) {
                    if (answer.getSelectedOption() != null) {
                        csv.append("\"").append(answer.getSelectedOption().getText().replace("\"", "\"\"")).append("\"");
                    }
                } else if (question.getType() == QuestionType.MULTI_SELECT) {
                    if (answer.getSelectedOptions() != null && !answer.getSelectedOptions().isEmpty()) {
                        String optionsText = answer.getSelectedOptions().stream()
                            .map(option -> option.getText())
                            .collect(java.util.stream.Collectors.joining(", "));
                        csv.append("\"").append(optionsText.replace("\"", "\"\"")).append("\"");
                    }
                } else if (question.getType() == QuestionType.RATING_SCALE) {
                    if (answer.getRatingValue() != null) {
                        csv.append(answer.getRatingValue());
                    }
                } else if (question.getType() == QuestionType.DATE) {
                    if (answer.getDateValue() != null) {
                        csv.append("\"").append(answer.getDateValue().replace("\"", "\"\"")).append("\"");
                    }
                }
            }
        }
        csv.append("\n");

        return csv.toString();
    }
}
