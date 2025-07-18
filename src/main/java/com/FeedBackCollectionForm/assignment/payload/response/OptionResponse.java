package com.FeedBackCollectionForm.assignment.payload.response;

import com.FeedBackCollectionForm.assignment.model.Option;
import lombok.Data;

@Data
public class OptionResponse {
    private Long id;
    private String text;
    private Integer displayOrder;

    public void setId(Long id) {
        this.id = id;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    public static OptionResponse fromEntity(Option option) {
        OptionResponse response = new OptionResponse();
        response.setId(option.getId());
        response.setText(option.getText());
        response.setDisplayOrder(option.getDisplayOrder());
        return response;
    }
}
