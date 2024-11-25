package com.ssafy.ssam.domain.consult.entity;

import com.ssafy.ssam.domain.consult.dto.request.ConsultRequestDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Builder
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Entity
@Getter
@Setter
@Table(name = "consult")
public class Consult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "consult_id")
    private Integer consultId;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "actual_date", columnDefinition = "TIMESTAMP")
    private LocalDateTime actualDate;

    @Column(name = "running_time")
    private Integer runningTime;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String content;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "webrtc_session_id", length = 100)
    private String webrtcSessionId;

    @Column(name = "access_code")
    private String accessCode;

    @Column(name = "att_school")
    private Integer attSchool;

    @Column(name = "att_grade", columnDefinition = "TINYINT")
    private Integer attGrade;

    @Column(name = "att_classroom", columnDefinition = "TINYINT")
    private Integer attClassroom;

    public static Consult toConsult(ConsultRequestDto requestDto) {
        return Consult.builder()
                .appointment(requestDto.getAppointment())
                .runningTime((int) Duration.between(LocalDateTime.now(), requestDto.getActualDate()).toMinutes())
                .actualDate(requestDto.getActualDate())
                .accessCode(requestDto.getAccessCode())
                .webrtcSessionId(requestDto.getWebrtcSessionId())
                .content(requestDto.getContent())
                .videoUrl(requestDto.getVideoUrl())
                .build();
    }

}
