package com.ssafy.ssam.global.chatbot.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionRequestDto {
    @NotNull
    String content;
}
