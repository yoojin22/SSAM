package com.ssafy.ssam.domain.user.dto.request;

import com.ssafy.ssam.domain.user.entity.AlarmType;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class AlarmCreateRequestDto {
    @NotNull
    private Integer userId;
    @NotNull
    private AlarmType alarmType;
    private String accessCode;
}
