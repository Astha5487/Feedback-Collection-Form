package com.FeedBackCollectionForm.assignment.repository;
import com.FeedBackCollectionForm.assignment.model.Form;
import com.FeedBackCollectionForm.assignment.model.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<Response, Long> {
    List<Response> findByForm(Form form);

    List<Response> findByFormOrderBySubmittedAtDesc(Form form);

    List<Response> findByRespondentEmailOrderBySubmittedAtDesc(String email);

    long countByForm(Form form);
}
