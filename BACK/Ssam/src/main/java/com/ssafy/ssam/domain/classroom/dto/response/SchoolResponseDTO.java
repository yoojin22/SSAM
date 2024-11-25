package com.ssafy.ssam.domain.classroom.dto.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class SchoolResponseDTO {
    private String schoolName;
    private Integer schoolId;
}
