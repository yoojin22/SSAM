package com.ssafy.ssam.domain.consult.dto.response;

import com.ssafy.ssam.domain.consult.entity.Appointment;
import com.ssafy.ssam.domain.consult.entity.AppointmentTopic;
import com.ssafy.ssam.domain.consult.entity.Consult;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class ConsultSummaryDetailResponseDto {
    //consult
    private Integer consultId;
    private LocalDateTime actualDate;
    private Integer runningTime;
    private Integer attSchool;
    private Integer attGrade;
    private Integer attClassroom;
    private String videoUrl;
    
    //summary
    private String keyPoint;
    private int profanityCount;
    private String profanityLevel;
    private String parentConcern;
    private String teacherRecommendation;

    //appointment
    private Integer studentId;
    private AppointmentTopic topic;

}
