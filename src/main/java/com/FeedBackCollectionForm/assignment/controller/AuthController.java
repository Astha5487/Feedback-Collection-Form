package com.FeedBackCollectionForm.assignment.controller;

import com.FeedBackCollectionForm.assignment.exception.RoleNotFoundException;
import com.FeedBackCollectionForm.assignment.model.ERole;
import com.FeedBackCollectionForm.assignment.model.Role;
import com.FeedBackCollectionForm.assignment.model.User;
import com.FeedBackCollectionForm.assignment.payload.request.ForgotPasswordRequest;
import com.FeedBackCollectionForm.assignment.payload.request.LoginRequest;
import com.FeedBackCollectionForm.assignment.payload.request.SignupRequest;
import com.FeedBackCollectionForm.assignment.payload.response.JwtResponse;
import com.FeedBackCollectionForm.assignment.payload.response.MessageResponse;
import com.FeedBackCollectionForm.assignment.repository.RoleRepository;
import com.FeedBackCollectionForm.assignment.repository.UserRepository;
import com.FeedBackCollectionForm.assignment.security.jwt.JwtUtils;
import com.FeedBackCollectionForm.assignment.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175", 
                      "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"}, 
           maxAge = 3600, allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private JavaMailSender emailSender;

    @Value("${spring.mail.enabled:true}")
    private boolean mailEnabled;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("Signin request received for username: " + loginRequest.getUsername());
        System.out.println("Request details: " + loginRequest);

        try {
            // Check if the user exists first
            try {
                boolean userExists = userRepository.existsByUsername(loginRequest.getUsername());
                System.out.println("User exists check result: " + userExists);

                if (!userExists) {
                    System.out.println("User not found: " + loginRequest.getUsername());
                    return ResponseEntity.ok(new MessageResponse("Error: Username not found. Please check your credentials."));
                }
            } catch (Exception userCheckError) {
                System.err.println("Error checking if user exists: " + userCheckError.getMessage());
                userCheckError.printStackTrace();
                // Continue with authentication attempt even if user check fails
                System.out.println("Continuing with authentication attempt despite user check error");
            }

            try {
                System.out.println("Attempting to authenticate user: " + loginRequest.getUsername());
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

                System.out.println("Setting authentication in SecurityContext");
                SecurityContextHolder.getContext().setAuthentication(authentication);

                System.out.println("Generating JWT token");
                String jwt = jwtUtils.generateJwtToken(authentication);

                System.out.println("Getting user details from authentication");
                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                List<String> roles = userDetails.getAuthorities().stream()
                        .map(item -> item.getAuthority())
                        .collect(Collectors.toList());

                System.out.println("Authentication successful for user: " + loginRequest.getUsername() + ", roles: " + roles);
                return ResponseEntity.ok(new JwtResponse(jwt,
                        userDetails.getId(),
                        userDetails.getUsername(),
                        userDetails.getEmail(),
                        roles));
            } catch (Exception authError) {
                // Log the authentication exception
                System.err.println("Authentication error for user " + loginRequest.getUsername() + ": " + authError.getMessage());
                authError.printStackTrace();

                // Return a meaningful error message but with 200 OK status to avoid frontend issues
                return ResponseEntity.ok(new MessageResponse("Error: Login failed. Please check your credentials."));
            }
        } catch (Exception e) {
            // Log the exception for server-side troubleshooting
            System.err.println("Unexpected error during authentication: " + e.getMessage());
            e.printStackTrace();

            // Return a meaningful error message but with 200 OK status to avoid frontend issues
            return ResponseEntity.ok(new MessageResponse("Error: An unexpected error occurred. Please try again later."));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        System.out.println("Signup request received for username: " + signUpRequest.getUsername());
        System.out.println("Request details: " + signUpRequest);

        try {
            // Validate username uniqueness
            try {
                boolean usernameExists = userRepository.existsByUsername(signUpRequest.getUsername());
                System.out.println("Username exists check result: " + usernameExists);

                if (usernameExists) {
                    System.out.println("Username already taken: " + signUpRequest.getUsername());
                    return ResponseEntity.ok(new MessageResponse("Error: Username is already taken!"));
                }
            } catch (Exception usernameCheckError) {
                System.err.println("Error checking if username exists: " + usernameCheckError.getMessage());
                usernameCheckError.printStackTrace();
                // Continue with registration attempt even if username check fails
                System.out.println("Continuing with registration attempt despite username check error");
            }

            // Validate email uniqueness
            try {
                boolean emailExists = userRepository.existsByEmail(signUpRequest.getEmail());
                System.out.println("Email exists check result: " + emailExists);

                if (emailExists) {
                    System.out.println("Email already in use: " + signUpRequest.getEmail());
                    return ResponseEntity.ok(new MessageResponse("Error: Email is already in use!"));
                }
            } catch (Exception emailCheckError) {
                System.err.println("Error checking if email exists: " + emailCheckError.getMessage());
                emailCheckError.printStackTrace();
                // Continue with registration attempt even if email check fails
                System.out.println("Continuing with registration attempt despite email check error");
            }

            System.out.println("Creating new user account for: " + signUpRequest.getUsername());

            // Create new user's account
            User user = null;
            try {
                String encodedPassword = encoder.encode(signUpRequest.getPassword());
                System.out.println("Password encoded successfully");

                user = new User(signUpRequest.getUsername(),
                        signUpRequest.getEmail(),
                        signUpRequest.getFullName(),
                        signUpRequest.getPhoneNo(),
                        encodedPassword);
                System.out.println("User object created successfully");
            } catch (Exception userCreationError) {
                System.err.println("Error creating user object: " + userCreationError.getMessage());
                userCreationError.printStackTrace();
                return ResponseEntity.ok(new MessageResponse("Error: Failed to create user. " + userCreationError.getMessage()));
            }

            Set<String> strRoles = signUpRequest.getRoles();
            Set<Role> roles = new HashSet<>();

            // Assign roles to the user - always use the default USER role to avoid issues
            try {
                System.out.println("Assigning default USER role");

                // Try to find the USER role
                Role userRole = null;
                try {
                    System.out.println("Looking for USER role in database");
                    userRole = roleRepository.findByNameWithLogging(ERole.ROLE_USER).orElse(null);

                    if (userRole != null) {
                        System.out.println("Found USER role in database: " + userRole.getId());
                        roles.add(userRole);
                        System.out.println("Assigned default USER role: " + userRole);
                    } else {
                        System.err.println("Could not find USER role, creating it");

                        // Create the USER role if it doesn't exist
                        try {
                            System.out.println("Creating new USER role");
                            Role newUserRole = new Role();
                            newUserRole.setName(ERole.ROLE_USER);

                            System.out.println("Saving new USER role to database");
                            Role savedRole = roleRepository.save(newUserRole);
                            System.out.println("New USER role saved with ID: " + savedRole.getId());

                            roles.add(savedRole);
                            System.out.println("Created and assigned new USER role: " + savedRole);
                        } catch (Exception roleCreationError) {
                            System.err.println("Error creating USER role: " + roleCreationError.getMessage());
                            roleCreationError.printStackTrace();
                            // Continue without this role rather than failing
                            System.out.println("Continuing without USER role due to creation error");
                        }
                    }
                } catch (Exception roleFindingError) {
                    System.err.println("Error finding USER role: " + roleFindingError.getMessage());
                    roleFindingError.printStackTrace();

                    // Create the USER role if there was an error finding it
                    try {
                        System.out.println("Creating new USER role after finding error");
                        Role newUserRole = new Role();
                        newUserRole.setName(ERole.ROLE_USER);

                        System.out.println("Saving new USER role to database after finding error");
                        Role savedRole = roleRepository.save(newUserRole);
                        System.out.println("New USER role saved with ID after finding error: " + savedRole.getId());

                        roles.add(savedRole);
                        System.out.println("Created and assigned new USER role after error: " + savedRole);
                    } catch (Exception roleCreationError) {
                        System.err.println("Error creating USER role after finding error: " + roleCreationError.getMessage());
                        roleCreationError.printStackTrace();
                        // Continue without roles rather than failing
                        System.out.println("Continuing without USER role due to creation error after finding error");
                    }
                }

                // If the user requested ADMIN role, try to add it
                if (strRoles != null) {
                    System.out.println("Checking for ADMIN role in requested roles: " + strRoles);

                    for (String role : strRoles) {
                        System.out.println("Checking role: " + role);

                        // Check for both "ROLE_ADMIN" and "admin" for compatibility
                        if (role != null && (role.equals("ROLE_ADMIN") || role.toLowerCase().trim().equals("admin"))) {
                            System.out.println("ADMIN role requested, attempting to assign");

                            try {
                                System.out.println("Looking for ADMIN role in database");
                                Role adminRole = roleRepository.findByNameWithLogging(ERole.ROLE_ADMIN).orElse(null);

                                if (adminRole != null) {
                                    System.out.println("Found ADMIN role in database: " + adminRole.getId());
                                    roles.add(adminRole);
                                    System.out.println("Added ADMIN role: " + adminRole);
                                } else {
                                    System.out.println("ADMIN role not found, creating it");

                                    // Create the ADMIN role if it doesn't exist
                                    try {
                                        System.out.println("Creating new ADMIN role");
                                        Role newAdminRole = new Role();
                                        newAdminRole.setName(ERole.ROLE_ADMIN);

                                        System.out.println("Saving new ADMIN role to database");
                                        Role savedRole = roleRepository.save(newAdminRole);
                                        System.out.println("New ADMIN role saved with ID: " + savedRole.getId());

                                        roles.add(savedRole);
                                        System.out.println("Created and assigned new ADMIN role: " + savedRole);
                                    } catch (Exception roleCreationError) {
                                        System.err.println("Error creating ADMIN role: " + roleCreationError.getMessage());
                                        roleCreationError.printStackTrace();
                                        // Continue without this role rather than failing
                                        System.out.println("Continuing without ADMIN role due to creation error");
                                    }
                                }
                            } catch (Exception roleFindingError) {
                                System.err.println("Error finding ADMIN role: " + roleFindingError.getMessage());
                                roleFindingError.printStackTrace();

                                // Try to create the ADMIN role if there was an error finding it
                                try {
                                    System.out.println("Creating new ADMIN role after finding error");
                                    Role newAdminRole = new Role();
                                    newAdminRole.setName(ERole.ROLE_ADMIN);

                                    System.out.println("Saving new ADMIN role to database after finding error");
                                    Role savedRole = roleRepository.save(newAdminRole);
                                    System.out.println("New ADMIN role saved with ID after finding error: " + savedRole.getId());

                                    roles.add(savedRole);
                                    System.out.println("Created and assigned new ADMIN role after error: " + savedRole);
                                } catch (Exception roleCreationError) {
                                    System.err.println("Error creating ADMIN role after finding error: " + roleCreationError.getMessage());
                                    roleCreationError.printStackTrace();
                                    // Continue without ADMIN role
                                    System.out.println("Continuing without ADMIN role due to creation error after finding error");
                                }
                            }
                            break;
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("Error assigning roles: " + e.getMessage());
                e.printStackTrace();
                // Continue with empty roles rather than failing
                System.out.println("Continuing with empty roles set");
            }

            System.out.println("Setting roles for user: " + roles.size() + " roles");
            user.setRoles(roles);

            try {
                System.out.println("Saving user to database: " + user.getUsername());
                User savedUser = userRepository.save(user);
                System.out.println("User saved successfully with ID: " + savedUser.getId());

                // Log the saved user details (excluding password)
                System.out.println("Saved user details: username=" + savedUser.getUsername() + 
                                  ", email=" + savedUser.getEmail() + 
                                  ", fullName=" + savedUser.getFullName() + 
                                  ", roles=" + savedUser.getRoles().size());

                return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
            } catch (Exception e) {
                System.err.println("Error saving user: " + e.getMessage());
                e.printStackTrace();

                // Try to provide more specific error information
                String errorMessage = e.getMessage();
                if (e.getCause() != null) {
                    errorMessage += " Caused by: " + e.getCause().getMessage();
                }

                // Check for common database errors
                if (errorMessage.contains("constraint") || errorMessage.contains("Duplicate")) {
                    return ResponseEntity.ok(new MessageResponse("Error: Registration failed. The username or email may already be in use."));
                } else if (errorMessage.contains("connection") || errorMessage.contains("Connection")) {
                    return ResponseEntity.ok(new MessageResponse("Error: Registration failed. Database connection issue. Please try again later."));
                } else {
                    return ResponseEntity.ok(new MessageResponse("Error: Registration failed. " + errorMessage));
                }
            }
        } catch (Exception e) {
            // Log the exception for server-side troubleshooting
            System.err.println("Unexpected error during user registration: " + e.getMessage());
            e.printStackTrace();

            // Return a meaningful error message with 200 OK status to avoid frontend issues
            return ResponseEntity.ok(new MessageResponse("Error: Registration failed. Please try again later."));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        try {
            // Find user by username
            String username = forgotPasswordRequest.getUsername();
            System.out.println("Processing forgot password request for username: " + username);

            User user = userRepository.findByUsername(username)
                    .orElse(null);

            if (user == null) {
                System.out.println("User not found with username: " + username);
                // Return 200 OK with error message to avoid frontend issues
                return ResponseEntity.ok(new MessageResponse("Error: User not found with username: " + username));
            }

            System.out.println("User found: " + user.getUsername() + ", email: " + user.getEmail());

            // Generate a new random password
            String newPassword = generateRandomPassword();
            System.out.println("Generated new password for user");

            // Update the user's password in the database
            user.setPassword(encoder.encode(newPassword));
            userRepository.save(user);
            System.out.println("Updated user password in database");

            if (mailEnabled) {
                try {
                    // Send an email with the new password
                    SimpleMailMessage message = new SimpleMailMessage();
                    message.setTo(user.getEmail());
                    message.setSubject("Password Reset");
                    message.setText("Your new password is: " + newPassword + 
                            "\n\nPlease change your password after logging in.");

                    System.out.println("Attempting to send email to: " + user.getEmail());
                    emailSender.send(message);
                    System.out.println("Email sent successfully");

                    return ResponseEntity.ok(new MessageResponse("A new password has been sent to your email."));
                } catch (Exception emailError) {
                    // Log the email sending error
                    System.err.println("Error sending email: " + emailError.getMessage());
                    emailError.printStackTrace();

                    // Return success response anyway since the password was reset
                    System.out.println("Returning success response despite email error");
                    return ResponseEntity.ok(new MessageResponse(
                        "Password has been reset, but there was an error sending the email. " +
                        "Please contact support to get your new password. Error: " + emailError.getMessage()));
                }
            } else {
                // Email sending is disabled, return the password directly in the response
                System.out.println("Email sending is disabled, returning password directly in response");
                return ResponseEntity.ok(new MessageResponse(
                    "Password has been reset. Your new password is: " + newPassword + 
                    "\nPlease change your password after logging in."));
            }
        } catch (Exception e) {
            // Log the exception for server-side troubleshooting
            System.err.println("Error during password reset: " + e.getMessage());
            e.printStackTrace();

            // Return a meaningful error message with 200 OK status to avoid frontend issues
            return ResponseEntity.ok(new MessageResponse("Error: Password reset failed. " + e.getMessage()));
        }
    }

    /**
     * Generates a random password with 10 characters including letters, numbers, and special characters.
     * 
     * @return A random password
     */
    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();

        // Generate a password with 10 characters
        for (int i = 0; i < 10; i++) {
            int randomIndex = random.nextInt(chars.length());
            sb.append(chars.charAt(randomIndex));
        }

        return sb.toString();
    }
}
