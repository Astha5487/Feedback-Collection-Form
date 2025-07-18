package com.FeedBackCollectionForm.assignment.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:5173", 
                    "http://localhost:5174", 
                    "http://localhost:5175",
                    "http://127.0.0.1:5173", 
                    "http://127.0.0.1:5174", 
                    "http://127.0.0.1:5175"
                ) // Use same origins as in WebSecurityConfig
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "x-auth-token")
                .allowCredentials(true) // If you're using cookies or Authorization header
                .maxAge(3600);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward requests to the root path to index.html
        registry.addViewController("/").setViewName("forward:/index.html");

        // Forward requests to any path that doesn't start with /api/ to index.html
        // This allows the React router to handle client-side routing
        registry.addViewController("/{x:[^\\.]*}").setViewName("forward:/index.html");

        // Forward paths to index.html for client-side routing
        // Explicitly exclude paths starting with /api/
        registry.addViewController("/app/**").setViewName("forward:/index.html");
        registry.addViewController("/form/**").setViewName("forward:/index.html");
        registry.addViewController("/forms/**").setViewName("forward:/index.html");
        registry.addViewController("/login").setViewName("forward:/index.html");
        registry.addViewController("/register").setViewName("forward:/index.html");
    }
}
