package com.FeedBackCollectionForm.assignment.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OptionRequest {
    @NotBlank
    @Size(max = 255)
    private String text;

    private Integer displayOrder;

    public String getText() {
        return text;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}
