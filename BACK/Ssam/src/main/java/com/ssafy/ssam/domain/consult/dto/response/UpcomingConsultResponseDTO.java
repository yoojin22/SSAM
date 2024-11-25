package com.ssafy.ssam.domain.consult.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpcomingConsultResponseDTO {

    private Integer consultId;
    private String accessCode;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String studentName;
}
