package com.ssafy.ssam.domain.classroom.dto.response;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BoardGetByPinResponseDTO {

    private Integer boardId;
    private String schoolName;
    private Integer grade;
    private Integer classroom;
    private String teacherName;
    private String teacherImage;
    private String isDeleted;

}
