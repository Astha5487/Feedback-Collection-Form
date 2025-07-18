package com.FeedBackCollectionForm.assignment.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.view.RedirectView;

/**
 * Controller to handle direct access to /forms path.
 * This is needed because users might try to access http://localhost:9191/forms directly.
 */
@Controller
@RequestMapping("/forms")
public class FormsController {

    /**
     * Redirects /forms to the root path, which will be handled by the frontend router.
     * 
     * @return A redirect view to the root path
     */
    @GetMapping
    public RedirectView redirectToIndex() {
        return new RedirectView("/");
    }

    /**
     * Redirects /forms/** to the root path, which will be handled by the frontend router.
     * 
     * @return A redirect view to the root path
     */
    @GetMapping("/**")
    public RedirectView redirectAllToIndex() {
        return new RedirectView("/");
    }
}