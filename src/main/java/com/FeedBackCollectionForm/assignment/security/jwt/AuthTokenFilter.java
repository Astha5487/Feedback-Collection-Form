package com.FeedBackCollectionForm.assignment.security.jwt;

import com.FeedBackCollectionForm.assignment.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuthTokenFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Value("${app.jwt.header}")
    private String headerName;

    @Value("${app.jwt.prefix}")
    private String headerPrefix;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // Log all requests for debugging
            String path = request.getRequestURI();
            String method = request.getMethod();
            logger.info("Processing request: {} {}", method, path);

            // Skip token validation for auth endpoints and permitted paths
            if (path.startsWith("/api/auth/") || 
                path.equals("/api/health") || 
                path.startsWith("/api/test/") || 
                path.equals("/api") || 
                path.startsWith("/h2-console/") ||
                path.equals("/") || 
                path.equals("/index.html") || 
                path.startsWith("/css/") || 
                path.startsWith("/js/") || 
                path.startsWith("/images/") || 
                path.startsWith("/assets/")) {

                logger.info("Skipping token validation for permitted endpoint: {}", path);
            } else {
                // Only validate token for protected endpoints
                String jwt = parseJwt(request);
                logger.info("JWT token present: {}", (jwt != null));

                if (jwt != null) {
                    boolean isValid = jwtUtils.validateJwtToken(jwt);
                    logger.info("JWT token valid: {}", isValid);

                    if (isValid) {
                        String username = jwtUtils.getUserNameFromJwtToken(jwt);
                        logger.info("Username from token: {}", username);

                        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        logger.info("Authentication set for user: {}", username);
                    }
                } else {
                    logger.info("No JWT token found in request, continuing without authentication");
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage(), e);
        }

        // Always continue the filter chain
        logger.info("Continuing filter chain for: {}", request.getRequestURI());
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader(headerName);

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith(headerPrefix)) {
            return headerAuth.substring(headerPrefix.length());
        }

        return null;
    }
}
