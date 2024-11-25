package com.ssafy.ssam.domain.consult.dto.response;

import com.ssafy.ssam.domain.consult.entity.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDto {

    private Integer appointmentId;
    @NotNull(message = "신청하는 사람은 Null 일 수 없습니다!")
    private Integer studentId;
    @NotNull(message = "신청하는 사람은 Null 일 수 없습니다!")
    private String studentName;
    @NotNull(message = "선생님은 Null 일 수 없습니다!")
    private Integer teacherId;
    private String description;
    private String topic;
    @NotNull(message = "시작시간은 Null 일 수 없습니다!")
    private LocalDateTime startTime;
    @NotNull(message = "종료시간은 Null 일 수 없습니다!")
    private LocalDateTime endTime;
    @NotNull(message = "상태는 Null 일 수 없습니다!")
    private AppointmentStatus status;

    private String accessCode;
    private Integer consultId;
}
