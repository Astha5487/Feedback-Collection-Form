package com.FeedBackCollectionForm.assignment.service;

import com.FeedBackCollectionForm.assignment.model.*;
import com.FeedBackCollectionForm.assignment.payload.request.FormRequest;
import com.FeedBackCollectionForm.assignment.payload.request.OptionRequest;
import com.FeedBackCollectionForm.assignment.payload.request.QuestionRequest;
import com.FeedBackCollectionForm.assignment.payload.response.FormResponse;
import com.FeedBackCollectionForm.assignment.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FormService {

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public FormResponse createForm(FormRequest formRequest, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Form form = new Form();
        form.setTitle(formRequest.getTitle());
        form.setDescription(formRequest.getDescription());
        form.setCreatedBy(user);

        Form savedForm = formRepository.save(form);

        // Create questions
        for (int i = 0; i < formRequest.getQuestions().size(); i++) {
            QuestionRequest questionRequest = formRequest.getQuestions().get(i);
            Question question = new Question();
            question.setText(questionRequest.getText());
            question.setType(questionRequest.getType());
            question.setDisplayOrder(questionRequest.getDisplayOrder() != null ? questionRequest.getDisplayOrder() : i);
            question.setRequired(questionRequest.getRequired());
            question.setForm(savedForm);

            Question savedQuestion = questionRepository.save(question);

            // Create options for multiple-choice questions
            if (questionRequest.getType() == QuestionType.MULTIPLE_CHOICE) {
                for (int j = 0; j < questionRequest.getOptions().size(); j++) {
                    OptionRequest optionRequest = questionRequest.getOptions().get(j);
                    Option option = new Option();
                    option.setText(optionRequest.getText());
                    option.setDisplayOrder(optionRequest.getDisplayOrder() != null ? optionRequest.getDisplayOrder() : j);
                    option.setQuestion(savedQuestion);
                    optionRepository.save(option);
                }
            }
        }

        return FormResponse.fromEntity(savedForm, 0);
    }

    @Transactional(readOnly = true)
    public List<FormResponse> getAllFormsByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return formRepository.findByCreatedBy(user).stream()
                .map(form -> FormResponse.fromEntity(form, responseRepository.countByForm(form)))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FormResponse getFormById(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Form form = formRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        if (!form.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to access this form");
        }

        return FormResponse.fromEntity(form, responseRepository.countByForm(form));
    }

    @Transactional(readOnly = true)
    public FormResponse getFormByPublicUrl(String publicUrl) {
        Form form = formRepository.findByPublicUrl(publicUrl)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        return FormResponse.fromEntity(form, responseRepository.countByForm(form));
    }

    @Transactional
    public void deleteForm(Long id, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Form form = formRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        if (!form.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this form");
        }

        formRepository.delete(form);
    }
}