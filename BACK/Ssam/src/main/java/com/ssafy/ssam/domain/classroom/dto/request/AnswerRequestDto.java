package com.ssafy.ssam.domain.classroom.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@AllArgsConstructor
@RequiredArgsConstructor
public class AnswerRequestDto {
    @NotNull(message = "boardId는 null일 수 없습니다")
    private Integer boardId;
    @NotNull(message = "answer은 null일 수 없습니다")
    private String answer;
}
