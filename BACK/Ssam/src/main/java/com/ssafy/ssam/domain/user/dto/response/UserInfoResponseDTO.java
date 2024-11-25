package com.ssafy.ssam.domain.user.dto.response;

import lombok.*;

import java.time.LocalDate;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponseDTO {

    private String profileImage;
    private String name;
    private LocalDate birth;
    private String school;
    private String username;
    private String email;
    private String selfPhone;
    private String otherPhone;
}
