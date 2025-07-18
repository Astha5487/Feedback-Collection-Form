package com.FeedBackCollectionForm.assignment.repository;

import com.FeedBackCollectionForm.assignment.model.ERole;
import com.FeedBackCollectionForm.assignment.model.Role;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Custom implementation of role repository methods to add more detailed logging.
 */
@Repository
public class CustomRoleRepositoryImpl implements CustomRoleRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Role> findByNameWithLogging(ERole name) {
        try {
            System.out.println("CustomRoleRepositoryImpl: Finding role by name: " + name);
            
            TypedQuery<Role> query = entityManager.createQuery(
                "SELECT r FROM Role r WHERE r.name = :name", Role.class);
            query.setParameter("name", name);
            
            Role role = query.getSingleResult();
            System.out.println("CustomRoleRepositoryImpl: Found role: " + role);
            return Optional.of(role);
        } catch (NoResultException e) {
            System.out.println("CustomRoleRepositoryImpl: No role found with name: " + name);
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("CustomRoleRepositoryImpl: Error finding role by name: " + name);
            System.err.println("CustomRoleRepositoryImpl: Error details: " + e.getMessage());
            e.printStackTrace();
            return Optional.empty();
        }
    }
}