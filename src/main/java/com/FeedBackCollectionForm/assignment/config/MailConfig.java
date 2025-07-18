package com.FeedBackCollectionForm.assignment.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

/**
 * Configuration class for JavaMailSender.
 * Provides a bean for JavaMailSender based on the properties in application.properties.
 * If email sending is disabled, it provides a dummy implementation that does nothing.
 */
@Configuration
public class MailConfig {

    @Value("${spring.mail.host:localhost}")
    private String host;

    @Value("${spring.mail.port:25}")
    private int port;

    @Value("${spring.mail.username:}")
    private String username;

    @Value("${spring.mail.password:}")
    private String password;

    @Value("${spring.mail.properties.mail.smtp.auth:false}")
    private boolean auth;

    @Value("${spring.mail.properties.mail.smtp.starttls.enable:false}")
    private boolean starttls;

    @Value("${spring.mail.enabled:false}")
    private boolean enabled;

    /**
     * Creates a JavaMailSender bean based on the properties in application.properties.
     * If email sending is disabled, it provides a dummy implementation that does nothing.
     * 
     * @return A JavaMailSender bean
     */
    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        
        // Only set username and password if they are provided and email is enabled
        if (enabled && username != null && !username.isEmpty()) {
            mailSender.setUsername(username);
            mailSender.setPassword(password);
        }
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", String.valueOf(auth));
        props.put("mail.smtp.starttls.enable", String.valueOf(starttls));
        
        // If email is disabled, set a property to indicate this
        if (!enabled) {
            props.put("mail.smtp.dummy", "true");
        }
        
        return mailSender;
    }
}