package com.FeedBackCollectionForm.assignment.repository;

import com.FeedBackCollectionForm.assignment.model.ERole;
import com.FeedBackCollectionForm.assignment.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for managing Role entities.
 * Extends CustomRoleRepository to add detailed logging capabilities.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long>, CustomRoleRepository {

    /**
     * Find a role by its name.
     * 
     * @param name The role name to search for
     * @return An Optional containing the role if found, or empty if not found
     */
    Optional<Role> findByName(ERole name);
}
