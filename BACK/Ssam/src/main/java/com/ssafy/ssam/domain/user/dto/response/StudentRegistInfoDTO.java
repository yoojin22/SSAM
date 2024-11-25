package com.ssafy.ssam.domain.user.dto.response;

import lombok.*;

import java.time.LocalDate;

@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class StudentRegistInfoDTO {

    private Integer studentId;
    private String name;
    private String username;
    private LocalDate followDate;

}