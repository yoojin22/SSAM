package com.ssafy.ssam.domain.user.dto.response;


import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StudentInfoListDTO {
    private Integer studentId;
    private String name;
    private String profileImage;
}
