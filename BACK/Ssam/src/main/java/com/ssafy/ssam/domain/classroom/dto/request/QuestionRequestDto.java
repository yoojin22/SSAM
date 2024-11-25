package com.ssafy.ssam.domain.classroom.dto.request;

import jakarta.validation.constraints.Size;
import lombok.*;

@RequiredArgsConstructor
@AllArgsConstructor
@Getter
public class QuestionRequestDto {
    @Size(min = 1, max = 50, message = "1자이상 50자 이하로 입력해야합니다")
    private String content;
}
