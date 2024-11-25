package com.ssafy.ssam.global.chatbot.dto.request;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.ssafy.ssam.global.chatbot.dto.Message;
import lombok.*;
import java.util.List;


@Setter
@Getter
@Builder
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class GPTRequest {

    private String model;
    private List<Message> messages;
    private float temperature;
    private int maxTokens;
    private float topP;
    private float frequencyPenalty;
    private float presencePenalty;

}