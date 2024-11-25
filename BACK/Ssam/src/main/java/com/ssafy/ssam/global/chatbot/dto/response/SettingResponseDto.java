package com.ssafy.ssam.global.chatbot.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class SettingResponseDto {
    private Integer chatbotId;
    private String content;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
