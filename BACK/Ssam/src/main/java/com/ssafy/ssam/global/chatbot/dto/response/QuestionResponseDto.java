package com.ssafy.ssam.global.chatbot.dto.response;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class QuestionResponseDto {
    @NotNull
    String content;
    LocalDateTime time;
}
