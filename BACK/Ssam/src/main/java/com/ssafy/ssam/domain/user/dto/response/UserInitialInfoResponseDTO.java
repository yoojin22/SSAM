package com.ssafy.ssam.domain.user.dto.response;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class UserInitialInfoResponseDTO {

    private Integer userId;
    private String username;
    private String name;
    private String school;
    private Integer boardId;
    private String role;
    private Integer teacherId;

}
