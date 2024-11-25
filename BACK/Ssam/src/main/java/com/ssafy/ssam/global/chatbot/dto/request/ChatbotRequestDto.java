package com.ssafy.ssam.global.chatbot.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatbotRequestDto {
    @NotNull
    private String content;
    @NotNull
    private Integer userId;
    @NotNull
    private Integer boardId;
    @NotNull
    private LocalDateTime startTime;
    @NotNull
    private LocalDateTime endTime;
}
