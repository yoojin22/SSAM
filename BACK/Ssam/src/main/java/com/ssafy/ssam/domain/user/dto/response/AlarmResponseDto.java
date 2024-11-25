package com.ssafy.ssam.domain.user.dto.response;

import com.ssafy.ssam.domain.user.entity.AlarmType;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AlarmResponseDto {
    private Integer alarmId;
    private AlarmType alarmType;
    private Integer state;
    private LocalDateTime alarmTime;

}
