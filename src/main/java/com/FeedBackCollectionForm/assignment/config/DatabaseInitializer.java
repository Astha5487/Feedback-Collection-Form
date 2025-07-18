package com.FeedBackCollectionForm.assignment.config;

import com.FeedBackCollectionForm.assignment.exception.RoleNotFoundException;
import com.FeedBackCollectionForm.assignment.model.ERole;
import com.FeedBackCollectionForm.assignment.model.Role;
import com.FeedBackCollectionForm.assignment.repository.RoleRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("Starting database initialization...");

        try {
            // Test database connection first
            try {
                System.out.println("Testing database connection...");
                Object result = entityManager.createNativeQuery("SELECT 1").getSingleResult();
                System.out.println("Database connection successful, result: " + result);
            } catch (Exception e) {
                System.err.println("Database connection failed: " + e.getMessage());
                e.printStackTrace();

                // Try to create a new connection
                try {
                    System.out.println("Attempting to create a new database connection...");
                    entityManager.clear();
                    Object result = entityManager.createNativeQuery("SELECT 1").getSingleResult();
                    System.out.println("New database connection successful, result: " + result);
                } catch (Exception e2) {
                    System.err.println("New database connection also failed: " + e2.getMessage());
                    e2.printStackTrace();
                    throw new RuntimeException("Database connection failed. Application cannot start without database.", e2);
                }
            }

            // Initialize roles if they don't exist
            System.out.println("Initializing roles...");
            for (ERole roleEnum : ERole.values()) {
                try {
                    System.out.println("Checking if role exists: " + roleEnum);

                    // First try using the repository
                    boolean roleExists = false;
                    try {
                        roleExists = roleRepository.findByNameWithLogging(roleEnum).isPresent();
                    } catch (Exception e) {
                        System.err.println("Error using repository to check role: " + e.getMessage());

                        // Fallback to direct query
                        try {
                            Long count = (Long) entityManager.createQuery(
                                "SELECT COUNT(r) FROM Role r WHERE r.name = :name")
                                .setParameter("name", roleEnum)
                                .getSingleResult();
                            roleExists = count > 0;
                            System.out.println("Direct query found role exists: " + roleExists);
                        } catch (Exception e2) {
                            System.err.println("Error with direct query to check role: " + e2.getMessage());
                            // Assume role doesn't exist if we can't check
                            roleExists = false;
                        }
                    }

                    System.out.println("Role " + roleEnum + " exists: " + roleExists);

                    if (!roleExists) {
                        System.out.println("Creating new role: " + roleEnum);
                        Role newRole = new Role();
                        newRole.setName(roleEnum);

                        try {
                            Role savedRole = roleRepository.save(newRole);
                            System.out.println("Created role: " + roleEnum + " with ID: " + savedRole.getId());
                        } catch (Exception e) {
                            System.err.println("Error saving role with repository: " + e.getMessage());

                            // Fallback to direct persist
                            try {
                                entityManager.persist(newRole);
                                entityManager.flush();
                                System.out.println("Created role with direct persist: " + roleEnum + " with ID: " + newRole.getId());
                            } catch (Exception e2) {
                                System.err.println("Error with direct persist of role: " + e2.getMessage());
                                throw e2; // Re-throw as this is critical
                            }
                        }
                    } else {
                        System.out.println("Role already exists: " + roleEnum);
                    }
                } catch (Exception e) {
                    System.err.println("Error creating role " + roleEnum + ": " + e.getMessage());
                    e.printStackTrace();
                    // Don't throw an exception here, as we want to continue initializing other roles
                    // even if one fails
                }
            }

            // Verify that all required roles exist after initialization
            System.out.println("Verifying all roles exist...");
            for (ERole roleEnum : ERole.values()) {
                System.out.println("Verifying role: " + roleEnum);

                boolean roleExists = false;
                try {
                    roleExists = roleRepository.findByNameWithLogging(roleEnum).isPresent();
                } catch (Exception e) {
                    System.err.println("Error using repository to verify role: " + e.getMessage());

                    // Fallback to direct query
                    try {
                        Long count = (Long) entityManager.createQuery(
                            "SELECT COUNT(r) FROM Role r WHERE r.name = :name")
                            .setParameter("name", roleEnum)
                            .getSingleResult();
                        roleExists = count > 0;
                        System.out.println("Direct query verified role exists: " + roleExists);
                    } catch (Exception e2) {
                        System.err.println("Error with direct query to verify role: " + e2.getMessage());
                        roleExists = false;
                    }
                }

                if (!roleExists) {
                    System.err.println("Warning: Role " + roleEnum + " could not be initialized. Attempting to create it again.");
                    try {
                        // Try to create the role again
                        Role newRole = new Role();
                        newRole.setName(roleEnum);

                        try {
                            Role savedRole = roleRepository.save(newRole);
                            System.out.println("Successfully created role on second attempt: " + roleEnum + " with ID: " + savedRole.getId());
                        } catch (Exception e) {
                            System.err.println("Error saving role with repository on second attempt: " + e.getMessage());

                            // Fallback to direct persist
                            try {
                                entityManager.persist(newRole);
                                entityManager.flush();
                                System.out.println("Created role with direct persist on second attempt: " + roleEnum + " with ID: " + newRole.getId());
                            } catch (Exception e2) {
                                System.err.println("Error with direct persist of role on second attempt: " + e2.getMessage());
                                System.err.println("Continuing without this role. Some functionality may be limited.");
                            }
                        }
                    } catch (Exception e) {
                        System.err.println("Error creating role " + roleEnum + " on second attempt: " + e.getMessage());
                        System.err.println("Continuing without this role. Some functionality may be limited.");
                    }
                } else {
                    System.out.println("Role verified: " + roleEnum);
                }
            }

            System.out.println("Database initialization completed successfully.");
        } catch (Exception e) {
            System.err.println("Error during database initialization: " + e.getMessage());
            e.printStackTrace();
            // Log the error but don't re-throw it, to allow the application to start
            System.err.println("Continuing despite database initialization errors. Some functionality may be limited.");
        }
    }
}
