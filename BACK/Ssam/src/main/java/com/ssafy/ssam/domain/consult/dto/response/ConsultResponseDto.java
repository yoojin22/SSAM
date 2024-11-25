package com.ssafy.ssam.domain.consult.dto.response;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class ConsultResponseDto {
    private Integer consultId;
    private Integer appointmentId;
    private LocalDate actualDate;
    private Integer runningTime;
    private String content;
    private String videoUrl;
    private String webrtcSessionId;
    private String accessCode;
    private Integer attSchool;
    private Integer attGrade;
    private Integer attClassroom;

}
