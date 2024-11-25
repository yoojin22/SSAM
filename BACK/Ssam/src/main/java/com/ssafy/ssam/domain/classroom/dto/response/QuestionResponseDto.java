package com.ssafy.ssam.domain.classroom.dto.response;

import java.time.LocalDateTime;

import lombok.*;

@AllArgsConstructor
@RequiredArgsConstructor
@Setter
@Getter
@Builder
public class QuestionResponseDto {

    private Integer questionId;
    private Integer studentId;
    private String studentName;
    private Integer boardId;
    private String content;
    private String answer;
    private LocalDateTime contentDate;
    private LocalDateTime answerDate;

}
