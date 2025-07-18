package com.FeedBackCollectionForm.assignment.repository;

import com.FeedBackCollectionForm.assignment.model.ERole;
import com.FeedBackCollectionForm.assignment.model.Role;

import java.util.Optional;

/**
 * Custom interface for role repository methods with additional logging.
 */
public interface CustomRoleRepository {
    
    /**
     * Find a role by its name with detailed logging.
     * 
     * @param name The role name to search for
     * @return An Optional containing the role if found, or empty if not found
     */
    Optional<Role> findByNameWithLogging(ERole name);
}